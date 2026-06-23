export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: "Missing GEMINI_API_KEY" });
  }

  const { propertyDetails, tone = "professional", mode = "standard" } = req.body;

  if (!propertyDetails) {
    return res.status(400).json({ error: "Missing property details" });
  }

  const {
    listingType = "For Sale",
    propertyType,
    location,
    bedrooms,
    bathrooms,
    furnishing,
    features,
    sizes,
    parking,
    garden,
    transport,
    epc,
    price,
  } = propertyDetails;

  // ── Build a structured brief for the AI ──────────────────────────────────
  const brief = [
    `Listing type: ${listingType}`,
    `Property type: ${propertyType}`,
    `Location: ${location}`,
    bedrooms  ? `Bedrooms: ${bedrooms}`   : null,
    bathrooms ? `Bathrooms: ${bathrooms}` : null,
    furnishing ? `Furnishing: ${furnishing}` : null,
    parking && parking !== "None" ? `Parking: ${parking}` : null,
    garden  && garden  !== "None" ? `Outdoor space: ${garden}` : null,
    transport ? `Transport: ${transport}` : null,
    epc       ? `EPC rating: Band ${epc}` : null,
    price     ? `${listingType === "To Let" ? "Rent" : "Price"}: ${price}` : null,
    features  ? `Key features: ${features}` : null,
    sizes?.sqft ? `Size: approximately ${sizes.sqft} ${sizes.unit === "ft" ? "sq ft" : "m²"}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  // ── Tone instructions ────────────────────────────────────────────────────
  const toneGuide = {
    professional:
      "Clear, confident, and polished. Balanced British English. No superlatives. Factual but engaging.",
    warm:
      "Friendly and inviting. Speak to the buyer/tenant as if showing them around. Convey warmth and lifestyle.",
    luxury:
      "Elevated, aspirational prose. Emphasise quality, exclusivity, and craftsmanship. Understated prestige — show don't tell.",
    punchy:
      "Short, punchy sentences. High-impact opening. Bullet the stand-out features. Under 120 words total.",
  };

  // ── Rental vs sale language ──────────────────────────────────────────────
  const listingContext =
    listingType === "To Let"
      ? "This is a rental listing. Write from a lettings perspective — mention suitability for tenants, EPC efficiency savings if relevant, and avoid buyer-specific language like 'purchase' or 'ownership'."
      : "This is a sales listing. Write from a buyer perspective — highlight ownership appeal, investment potential where appropriate, and long-term lifestyle benefits.";

  // ── Output length ────────────────────────────────────────────────────────
  const lengthGuide =
    mode === "moreDetail"
      ? "Write 3–4 flowing paragraphs (~300–450 words). Cover: headline appeal, interior highlights, outdoor/parking, location & transport, and a closing lifestyle statement."
      : "Write a single, punchy description of 2–3 short paragraphs (~120–200 words). Lead with the property's strongest selling point.";

  // ── Full prompt ──────────────────────────────────────────────────────────
  const prompt = `You are an expert UK estate agent copywriter with 15 years of experience writing listings for Rightmove and Zoopla. You write copy that sells.

TONE: ${toneGuide[tone] || toneGuide.professional}

CONTEXT: ${listingContext}

OUTPUT LENGTH: ${lengthGuide}

STRICT RULES:
- Write in British English (colour, centre, whilst, kerb, etc.)
- Do NOT open with: "A lovely", "A charming", "Welcome to", "Nestled", "Introducing", "This property", "Step inside", "We are pleased to present".
- Open with the property's strongest, most specific quality — not a generic statement.
- Vary sentence length and rhythm. Avoid repeating adjectives.
- Do NOT list features as a bullet list (unless tone is "punchy"). Weave them into flowing prose.
- Do NOT make up features, measurements, or facts not provided.
- Do NOT include a price or address unless explicitly provided.
- Comply with the Consumer Protection from Unfair Trading Regulations 2008 — no misleading claims.
- End with a subtle lifestyle or location hook, not a call-to-action phrase like "Don't miss out!".

PROPERTY BRIEF:
${brief}

Write the listing description now.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: mode === "moreDetail" ? 1.1 : 0.9,
            topP: 0.92,
            topK: 40,
            maxOutputTokens: mode === "moreDetail" ? 700 : 350,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(500).json({ error: data.error?.message || "Gemini request failed" });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No description generated.";

    return res.status(200).json({ description: text });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.message });
  }
}
