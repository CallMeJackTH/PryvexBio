# Pryvex Bio — Vercel + Supabase + ImgBB

The original site UI is retained. Public profile data is read from Supabase; admin changes are saved through the Vercel API; image uploads go through the server to ImgBB.

## 1. Local configuration

A `.env.local` file is included for local development. It contains server-side credentials and must never be committed to Git or shared publicly.

For a production deployment on Vercel, add the same four values from `.env.local` manually in Vercel → Project → Settings → Environment Variables; Vercel does not automatically import `.env.local` from a ZIP upload.

## 2. Configure Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `ADMIN_PASSWORD`: the admin login password you choose
- `SESSION_SECRET`: a long random string used to sign login sessions
- `SUPABASE_SECRET_KEY`: your Supabase secret key (server-side only)
- `IMGBB_API_KEY`: your ImgBB API key

The Supabase Project URL and publishable key are already set in `api/_config.js`. Never put secret keys in `index.html`.

## 3. Set up Supabase

Open Supabase → SQL Editor and run `supabase.sql` once. This creates the `site_config` table and public `pryvex` Storage bucket (Storage is not used for images when ImgBB is configured; the bucket is harmless and can remain).

## 4. Deploy

Import this folder into Vercel as a project (Framework Preset: Other), add the environment variables, then redeploy. Do not deploy only `index.html`: the `/api` folder is required.

## 5. Use

Open the deployed site, click the profile picture, log in using `ADMIN_PASSWORD`, edit the content and press “บันทึกและเผยแพร่”. Image uploads require a valid `IMGBB_API_KEY`.

## Notes

- `SUPABASE_SECRET_KEY`, `SESSION_SECRET`, and `ADMIN_PASSWORD` are server-only environment variables.
- If a secret was pasted into chat or committed to a repository, rotate it in the provider dashboard before public deployment.
- Profile reads are public by design; writes require the signed admin session.
