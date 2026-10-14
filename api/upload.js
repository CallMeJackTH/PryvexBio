const cfg = require('./_config');
const { ok } = require('./_auth');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).end();
  if (!ok(req)) return res.status(401).json({ error: 'unauthorized' });
  const apiKey = cfg('IMGBB_API_KEY');
  if (!apiKey) return res.status(500).json({ error: 'IMGBB_API_KEY is not configured' });
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const buf = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || '';
    if (!/^image\/(jpeg|png|webp)$/.test(contentType) || !buf.length || buf.length > 4 * 1024 * 1024) {
      return res.status(400).json({ error: 'bad image; use JPEG, PNG or WebP under 4 MB' });
    }
    const form = new FormData();
    form.append('image', buf.toString('base64'));
    const response = await fetch('https://api.imgbb.com/1/upload?key=' + encodeURIComponent(apiKey), {
      method: 'POST', body: form,
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data || !result.data.url) {
      return res.status(502).json({ error: 'imgbb upload failed', details: result.error?.message || 'Provider rejected image' });
    }
    return res.status(200).json({ url: result.data.url, display_url: result.data.display_url });
  } catch (error) {
    return res.status(500).json({ error: 'upload failed' });
  }
};
