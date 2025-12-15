export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: "Missing GEMINI_API_KEY" });
  }

  const { propertyDetails, mode } = req.body; 
  // mode = "standard" or "moreDetail"

  if (!propertyDetails) {
    return res.status(400).json({ error: "Missing property details" });
  }

  // ------------------------------
  //  PROMPT ENGINE v2 — Premium UK Estate Copy
  // ------------------------------

  const prompt = `
You are a senior UK real-estate copywriter creating premium listing descriptions.

Tone guidelines:
- Friendly, polished, modern UK English.
- Smooth narrative, no clichés.
- Do NOT always begin with: “A lovely”, “A charming”, “This property”, “Introducing”, “Nestled”, “Welcome to”.
- Open with a clean, confident statement about what the home *is*.
- Vary sentence structure and rhythm.

Content requirements:
- Property type and overall character.
- Key selling points.
- Location appeal + lifestyle benefits.
- Bedrooms, bathrooms, layout highlights.
- Interior features.
- Exterior features.
- Who the home suits (subtle, not pushy).
- Avoid repeating the same adjectives.
- Keep it concise and clear.

Detail level:
- Standard mode: Crisp, 3–5 sentences.
- MoreDetail mode: Richer, more descriptive, 2–3 short paragraphs.

PROPERTY INPUT:
${JSON.stringify(propertyDetails, null, 2)}

Write the description in the selected mode: "${mode}".
    `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: mode === "moreDetail" ? 1.3 : 1.0,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: mode === "moreDetail" ? 550 : 250,
          },
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
