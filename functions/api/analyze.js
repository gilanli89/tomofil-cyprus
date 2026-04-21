// Cloudflare Pages Function: /api/analyze
// Proxies image-analysis requests to Anthropic's Claude API.

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Get API key from Cloudflare environment variable
  const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
  
  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set ANTHROPIC_API_KEY in Cloudflare Pages settings.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No images provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              ...images,
              {
                type: 'text',
                text: `Analyze these car photos and extract the vehicle's details. Return ONLY valid JSON (no markdown, no explanation):

{
  "brand": "...",
  "model": "...",
  "year": 2020,
  "type": "Sedan|SUV|Pickup|Hatchback|Coupe|Van|Convertible",
  "color": "...",
  "condition": "Excellent|Good|Fair|Needs Work",
  "features": ["feature 1", "feature 2", ...]
}

Identify the brand (Toyota, BMW, Mercedes, etc.), specific model, estimated production year, body type, color, overall condition, and visible features (alloy wheels, sunroof, leather seats, LED lights, parking sensors, etc.). Be specific and accurate. If unsure, use best-guess values. Return ONLY the JSON object.`,
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${errorText}` }),
        { status: anthropicResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await anthropicResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
