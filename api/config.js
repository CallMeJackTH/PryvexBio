
const cfg = require('./_config');
const { ok } = require('./_auth');

const url = () => cfg('SUPABASE_URL').replace(/\/$/, '');
const t = (x, n) => String(x || '').slice(0, n);

function cleanDonate(d) {
  d = d && typeof d === 'object' ? d : {};

  const methods = Array.isArray(d.methods) ? d.methods : [];

  return {
    enabled: d.enabled !== false,
    title: t(d.title, 100),
    desc: t(d.desc, 500),
    wallet: t(d.wallet, 100),
    qrUrl: t(d.qrUrl, 1000),
    paymentLink: t(d.paymentLink, 1000),
    methods: methods.slice(0, 30).map((m, i) => ({
      id: t(m.id || `pay${i}`, 50),
      enabled: m.enabled !== false,
      bankName: t(m.bankName, 100),
      accountName: t(m.accountName, 150),
      accountNumber: t(m.accountNumber, 100),
      qrUrl: t(m.qrUrl, 1000),
      infoImageUrl: t(m.infoImageUrl, 1000),
      note: t(m.note, 500),
    })),
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const r = await fetch(
        url() + '/rest/v1/site_config?id=eq.main&select=data',
        {
          headers: {
            apikey: cfg('SUPABASE_PUBLISHABLE_KEY'),
          },
        }
      );

      if (!r.ok) {
        return res.status(502).json({ error: 'load failed' });
      }

      const rows = await r.json();
      return res.json(
        (Array.isArray(rows) && rows[0] && rows[0].data) || null
      );
    } catch (e) {
      return res.status(500).json({ error: 'load failed' });
    }
  }

  if (req.method === 'POST') {
    if (!ok(req)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const d = req.body;

    if (!d || !Array.isArray(d.links)) {
      return res.status(400).json({ error: 'bad data' });
    }

    try {
      // ถ้าหน้าเว็บรุ่นเก่าไม่ได้ส่ง donate มา
      // ให้อ่านข้อมูลเดิมเพื่อป้องกันช่องทางสนับสนุนถูกลบ
      let previous = {};

      if (!d.donate) {
        const old = await fetch(
          url() + '/rest/v1/site_config?id=eq.main&select=data',
          {
            headers: {
              apikey: cfg('SUPABASE_SECRET_KEY'),
            },
          }
        );

        if (old.ok) {
          const rows = await old.json();
          if (Array.isArray(rows) && rows[0]?.data) {
            previous = rows[0].data;
          }
        }
      }

      const bg = d.bg || {};

      const clean = {
        name: t(d.name, 60),
        bio: t(d.bio, 300),
        avatar: t(d.avatar, 1000),

        bg: {
          c1: t(bg.c1, 9),
          c2: t(bg.c2, 9),
          img: t(bg.img, 1000),
        },

        links: d.links.slice(0, 50).map((l) => ({
          id: t(l.id, 40),
          title: t(l.title, 80),
          url: t(l.url, 1000),
          desc: t(l.desc, 200),
          img: t(l.img, 1000),
        })),

        // บันทึกระบบสนับสนุนและ URL รูป QR ลงฐานข้อมูลด้วย
        donate: cleanDonate(d.donate || previous.donate),
      };

      const r = await fetch(
        url() + '/rest/v1/site_config?on_conflict=id',
        {
          method: 'POST',
          headers: {
            apikey: cfg('SUPABASE_SECRET_KEY'),
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            id: 'main',
            data: clean,
          }),
        }
      );

      if (!r.ok) {
        console.error('Supabase save failed:', await r.text());
        return res.status(500).json({ error: 'save failed' });
      }

      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('Config error:', e.message);
      return res.status(500).json({ error: 'save failed' });
    }
  }

  return res.status(405).end();
};
