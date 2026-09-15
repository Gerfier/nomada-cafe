# Nómada CMS login proxy

This is the piece that makes "Iniciar sesión con GitHub" work in `/admin`.
GitHub's OAuth flow needs a client secret exchanged server-side — Decap CMS
(which runs entirely in the browser on GitHub Pages) can't do that on its
own, so this tiny two-function app does it for you. It's separate from the
Nómada site itself; it just needs to live somewhere that can run a server
function, which GitHub Pages can't.

## 1. Create a GitHub OAuth App

Go to **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
(https://github.com/settings/developers) and fill in:

- **Application name**: `Nómada CMS` (anything you like)
- **Homepage URL**: `https://gerfier.github.io/nomada-cafe/`
- **Authorization callback URL**: leave a placeholder for now
  (`https://example.com/api/callback`) — you'll come back and fix this
  after step 2, once you know the real Vercel URL.

After creating it, GitHub shows you a **Client ID** and lets you generate a
**Client secret**. Copy both — you'll need them in step 2.

## 2. Deploy this folder to Vercel

From this `oauth-proxy/` folder:

```bash
npm i -g vercel   # one-time
vercel login      # one-time, opens a browser
vercel             # deploys this folder; accept the defaults
```

Vercel will print a URL like `https://nomada-cms-oauth-proxy.vercel.app`.
That's your proxy's base URL.

Then set the two secrets it needs (from step 1) as environment variables:

```bash
vercel env add OAUTH_CLIENT_ID production
vercel env add OAUTH_CLIENT_SECRET production
vercel --prod   # redeploy so the env vars take effect
```

## 3. Wire the three places that need this URL

1. **Back in the GitHub OAuth App** (step 1): set the
   **Authorization callback URL** to `<your-vercel-url>/api/callback`,
   e.g. `https://nomada-cms-oauth-proxy.vercel.app/api/callback`.
2. **`/admin/config.yml`** in the main site repo: set `base_url` to your
   Vercel URL (no trailing slash), e.g.
   `base_url: https://nomada-cms-oauth-proxy.vercel.app`.
3. Commit and push that `config.yml` change.

## 4. Try it

Visit `https://gerfier.github.io/nomada-cafe/admin/`, click login, and
authorize with a GitHub account that has write access to the
`Gerfier/nomada-cafe` repo (your own account works; add anyone else as a
collaborator on the repo first if they need to edit).

## Notes

- Anyone who can push directly to `main` on this repo can also self-approve
  CMS edits (Decap commits straight to `main` by default). If you want a
  review step before changes go live, add `editorial_workflow: true` to
  `admin/config.yml` — Decap will open a PR instead of committing directly,
  and you approve it from the CMS's own "Publish" button (or on GitHub).
- This proxy only ever sees a temporary `code` and exchanges it for a
  token; it never stores anything.
