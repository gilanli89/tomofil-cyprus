// Cloudflare Pages Function: /api/analyze
// Uses Google Gemini 1.5 Flash for FREE car image analysis

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Get API key from Cloudflare environment variable
  const GOOGLE_API_KEY = env.GOOGLE_API_KEY || 'AIzaSyDfNUt6aFjMOocrGC26LnPNlcYD3AZTvEQ';
  
  if (!GOOGLE_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GOOGLE_API_KEY in Cloudflare Pages settings.' }),
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

    // Convert images to Gemini format
    const imageParts = images.map(img => ({
      inline_data: {
        mime_type: img.source.media_type,
        data: img.source.data
      }
    }));

    // Gemini API request
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              ...imageParts,
              {
                text: `Analyze these car photos and extract the vehicle's details. Return ONLY valid JSON (no markdown, no backticks, no explanation):

{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "type": "Sedan",
  "color": "White",
  "condition": "Mükemmel",
  "features": ["LED Far", "Park Sensörü", "Klima"]
}

IMPORTANT:
- brand: Exact car manufacturer (BMW, Mercedes, Toyota, Ford, etc.)
- model: Specific model name (320i, Corolla, Mustang, etc.)
- year: Production year (best estimate)
- type: ONE of: Sedan, SUV, Pickup, Hatchback, Coupe, Cabrio, Van, Wagon, Crossover
- color: Main exterior color in Turkish (Beyaz, Siyah, Gri, Mavi, Kırmızı, etc.)
- condition: ONE of: Mükemmel, Çok İyi, İyi, Orta
- features: Array of visible features in Turkish (LED Far, Panoramik Tavan, Deri Koltuk, Park Sensörü, 360 Kamera, Sunroof, Cruise Control, Android Auto / CarPlay, Premium Ses Sistemi, etc.)

Return ONLY the JSON object, no other text.`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 10,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${errorText}` }),
        { status: geminiResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await geminiResponse.json();
    
    // Extract text from Gemini response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Parse JSON from text (remove markdown if present)
    const cleanJson = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const carData = JSON.parse(cleanJson);

    // Return in Claude-compatible format
    return new Response(
      JSON.stringify({
        content: [{
          type: 'text',
          text: JSON.stringify(carData)
        }]
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Analysis error:', err);
    return new Response(
      JSON.stringify({ 
        error: err.message,
        details: 'Failed to analyze image. Please try again.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
