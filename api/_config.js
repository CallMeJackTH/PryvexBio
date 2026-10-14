// Secure config loader: only reads from environment variables.
// Do NOT commit secrets to the repository. Set these values in your deployment platform (Vercel, Netlify, etc.)
module.exports = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing required env var ${k}. Set it in your environment.`);
  return v;
};
