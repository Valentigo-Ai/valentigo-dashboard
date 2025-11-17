export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: "Missing GEMINI_API_KEY" });
  }

  const propertyDetails = req.body;

  if (!propertyDetails) {
    return res.status(400).json({ error: "Missing property details" });
  }

  // ✨ Improved prompt for best results
  const prompt = `
You are an expert UK real estate copywriter. 
Write a friendly, professional, compelling property listing.

Include:
- Property type 
- Style and character
- Location appeal
- Bedroom + bathroom details
- Key features
- Lifestyle benefits
- Who the home suits
- Improvements or stand-out points

Make it polished, persuasive, and perfect for marketing.

PROPERTY INPUT:
${JSON.stringify(propertyDetails, null, 2)}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res
        .status(500)
        .json({ error: data.error?.message || "Gemini request failed" });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No description generated.";

    return res.status(200).json({ description: text });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.message });
  }
}
