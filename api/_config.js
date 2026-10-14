// Server-only configuration. Set these values in Vercel > Settings > Environment Variables.
// Never expose SUPABASE_SECRET_KEY, SESSION_SECRET, or ADMIN_PASSWORD in client-side HTML.
const C = {
  SUPABASE_URL: 'https://bfoqxsjlucmjvepbiycm.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_dRiNAwktfCr9tLCaIIbC-A_MUdMmMnL',
};
module.exports = (k) => process.env[k] || C[k] || '';
