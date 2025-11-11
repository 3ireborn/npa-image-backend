export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { prompt, style, ratio, captionTone } = req.body || {};
  const OPENAI_KEY = process.env.OPENAI_API_KEY || 'DUMMY';

  // MODE DUMMY – buat testing tanpa API Key
  if (OPENAI_KEY === 'DUMMY') {
    const mockImage = 'https://images.unsplash.com/photo-1581093588401-22db0d8a6d59?w=800';
    const mockCaption = `✨ [Mock Mode] ${captionTone} — Gambar ${style} (${ratio}).\n${prompt}`;
    return res.status(200).json({ ok: true, image: mockImage, caption: mockCaption });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `${prompt}, gaya: ${style}`,
        size: ratio === '1:1' ? '1024x1024' : '1024x1536'
      })
    });

    const data = await response.json();
    const imageUrl = data?.data?.[0]?.url;
    const caption = `✨ ${captionTone} — ${prompt}`;
    res.status(200).json({ ok: true, image: imageUrl, caption });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
