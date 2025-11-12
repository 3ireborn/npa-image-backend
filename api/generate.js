export default async function handler(req, res) {
  try {
    if (req.method !== 'POST')
      return res.status(405).json({ error: 'Method not allowed' });

    const { prompt = '', model = 'stabilityai/stable-diffusion-2' } = req.body || {};
    if (!prompt || prompt.length < 3)
      return res.status(400).json({ error: 'Prompt minimal 3 karakter' });

    const HF_TOKEN = process.env.HF_API_TOKEN || '';
    if (!HF_TOKEN) {
      return res.status(200).json({
        fallback: true,
        url: 'https://source.unsplash.com/featured/?inspiration,leadership',
        message: 'Token kosong – fallback Unsplash'
      });
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(502).json({ error: 'Hugging Face error', detail: txt });
    }

    const type = response.headers.get('content-type') || '';
    if (type.startsWith('image/')) {
      const buf = await response.arrayBuffer();
      const base64 = Buffer.from(buf).toString('base64');
      return res.status(200).json({ url: `data:${type};base64,${base64}` });
    }

    const data = await response.json().catch(() => null);
    if (Array.isArray(data) && typeof data[0] === 'string') {
      return res.status(200).json({ url: `data:image/png;base64,${data[0]}` });
    }

    return res.status(500).json({ error: 'Unexpected response', raw: data });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: String(err) });
  }
}
