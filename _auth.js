const c = require('crypto');
const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (e) => c.createHmac('sha256', secret()).update(String(e)).digest('hex');
exports.make = () => { const e = Date.now() + 12 * 3600e3; return e + '.' + sign(e); };
exports.ok = (req) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  const [e, s] = t.split('.');
  if (!e || !s || !secret() || Number(e) < Date.now()) return false;
  const a = Buffer.from(s), b = Buffer.from(sign(e));
  return a.length === b.length && c.timingSafeEqual(a, b);
};
exports.same = (a, b) => {
  const h = (x) => c.createHash('sha256').update(String(x)).digest();
  return c.timingSafeEqual(h(a), h(b));
};
