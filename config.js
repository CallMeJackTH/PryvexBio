const cfg = require('./_config');
const { ok } = require('./_auth');
const url = () => cfg('SUPABASE_URL').replace(/\/$/, '');
const t = (x, n) => String(x || '').slice(0, n);
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    try {
      const r = await fetch(url() + '/rest/v1/site_config?id=eq.main&select=data', {
        headers: { apikey: cfg('SUPABASE_PUBLISHABLE_KEY') },
      });
      const rows = await r.json();
      return res.json((Array.isArray(rows) && rows[0] && rows[0].data) || null);
    } catch (e) { return res.json(null); }
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
    try {
      const r = await fetch(url() + '/rest/v1/site_config?on_conflict=id', {
        method: 'POST',
        headers: {
          apikey: cfg('SUPABASE_SECRET_KEY'),
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ id: 'main', data: clean }),
      });
      if (!r.ok) throw new Error(await r.text());
      return res.json({ ok: true });
    } catch (e) { return res.status(500).json({ error: 'save failed' }); }
  }
  res.status(405).end();
};
