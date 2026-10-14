const cfg = require('./_config');
const { ok } = require('./_auth');

// Validate image magic bytes to reduce risk of forged content-type headers
const isJpeg = (buf) => buf.length > 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;
const isPng = (buf) => buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
const isWebp = (buf) => buf.length > 12 && buf.slice(0,4).toString() === 'RIFF' && buf.slice(8,12).toString() === 'WEBP';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!ok(req)) return res.status(401).json({ error: 'unauthorized' });
  const ch = []; for await (const c of req) ch.push(c);
  const buf = Buffer.concat(ch);
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (buf.length > 4e6) return res.status(400).json({ error: 'file too large' });

  // Accept only image/jpeg, image/png, image/webp and verify magic bytes
  if (!/^image\/(jpeg|png|webp)$/.test(ct)) return res.status(400).json({ error: 'bad content-type' });
  const okMagic = (ct.includes('jpeg') && isJpeg(buf)) || (ct.includes('png') && isPng(buf)) || (ct.includes('webp') && isWebp(buf));
  if (!okMagic) return res.status(400).json({ error: 'invalid image data' });

  const base = cfg('SUPABASE_URL').replace(/\/$/, '');
  const ext = ct.split('/')[1].replace(/[^a-z0-9]/g, '');
  const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  const r = await fetch(base + '/storage/v1/object/pryvex/' + encodeURIComponent(name), {
    method: 'POST',
    headers: { apikey: cfg('SUPABASE_SECRET_KEY'), 'Content-Type': ct },
    body: buf,
  });
  if (!r.ok) return res.status(500).json({ error: 'upload failed' });
  res.json({ url: base + '/storage/v1/object/public/pryvex/' + encodeURIComponent(name) });
};
