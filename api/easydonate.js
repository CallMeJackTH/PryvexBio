export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const expected = process.env.PRYVEX_DONATE_ADMIN_TOKEN;
  const actual = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!expected) return res.status(503).json({ error: 'Server setup missing PRYVEX_DONATE_ADMIN_TOKEN' });
  if (!actual || actual !== expected) return res.status(401).json({ error: 'Unauthorized' });

  const key = process.env.EASYDONATE_API_KEY;
  if (!key) return res.status(503).json({ error: 'Server setup missing EASYDONATE_API_KEY' });

  try {
    const upstream = await fetch('https://easydonate.app/api/v1/donations?page=1', {
      headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' }
    });
    const body = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'EasyDonate API error', status: upstream.status, detail: body?.message || body?.error || 'Request rejected' });
    }
    return res.status(200).json(body);
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach EasyDonate API' });
  }
}
