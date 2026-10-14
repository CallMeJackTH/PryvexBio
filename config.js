const { ok } = require('./_auth');
const KEY = 'pryvex_bio_config';
async function kv(cmd) {
  const r = await fetch(process.env.KV_REST_API_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN },
    body: JSON.stringify(cmd),
  });
  return (await r.json()).result;
}
const t = (x, n) => String(x || '').slice(0, n);
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    let v = null;
    try { v = await kv(['GET', KEY]); } catch (e) {}
    return res.json(v ? JSON.parse(v) : null);
  }
  if (req.method === 'POST') {
    if (!ok(req)) return res.status(401).json({ error: 'unauthorized' });
    const d = req.body;
    if (!d || !Array.isArray(d.links)) return res.status(400).json({ error: 'bad data' });
    const bg = d.bg || {};
    const clean = {
      name: t(d.name, 60), bio: t(d.bio, 300), avatar: t(d.avatar, 500),
      bg: { c1: t(bg.c1, 9), c2: t(bg.c2, 9), img: t(bg.img, 500) },
      links: d.links.slice(0, 50).map((l) => ({
        id: t(l.id, 40), title: t(l.title, 80), url: t(l.url, 500), desc: t(l.desc, 200), img: t(l.img, 500),
      })),
    };
    try { await kv(['SET', KEY, JSON.stringify(clean)]); } catch (e) { return res.status(500).json({ error: 'save failed' }); }
    return res.json({ ok: true });
  }
  res.status(405).end();
};
