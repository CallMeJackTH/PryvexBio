const { make, same } = require('./_auth');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const pw = process.env.ADMIN_PASSWORD; // รหัสอยู่ใน Environment Variable ไม่อยู่ใน HTML
  if (!pw || !same((req.body || {}).password || '', pw)) {
    await new Promise((r) => setTimeout(r, 800));
    return res.status(401).json({ error: 'bad password' });
  }
  res.json({ token: make() });
};
