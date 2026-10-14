const cfg = require('./_config');
const { ok } = require('./_auth');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!ok(req)) return res.status(401).json({ error: 'unauthorized' });
  const ch = []; for await (const c of req) ch.push(c);
  const buf = Buffer.concat(ch);
  const ct = req.headers['content-type'] || '';
  if (!/^image\/(jpeg|png|webp)$/.test(ct) || buf.length > 4e6) return res.status(400).json({ error: 'bad image' });
  const base = cfg('SUPABASE_URL').replace(/\/$/, '');
  const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ct.split('/')[1];
  const r = await fetch(base + '/storage/v1/object/pryvex/' + name, {
    method: 'POST',
    headers: { apikey: cfg('SUPABASE_SECRET_KEY'), 'Content-Type': ct },
    body: buf,
  });
  if (!r.ok) return res.status(500).json({ error: 'upload failed' });
  res.json({ url: base + '/storage/v1/object/public/pryvex/' + name });
};
