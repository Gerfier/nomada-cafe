# Nómada — Café de Especialidad

A single-page marketing site for **Nómada Café de Especialidad**, a specialty coffee shop in Ciudad Camargo, Chihuahua, México.

Live info used to build this: 5.0★ rated, #1 coffee spot in Ciudad Camargo (Tripadvisor), open daily, located at Allende 105, Col. Centro (per their Instagram [@ganasdenomadacafe](https://www.instagram.com/ganasdenomadacafe/) — this superseded an earlier, incorrect address sourced from Google Maps).

## Stack

Plain HTML/CSS/JS plus a tiny dependency-free build script (`build.js`, plain Node). Fonts load from Google Fonts (`Fraunces` for display type, `Work Sans` for body copy, `Caveat` for handwritten accents, `Anton` for condensed headlines).

```
index.html          page template: {{double-brace}} placeholders filled from content/
build.js            renders the template + JSON-LD + robots.txt + sitemap.xml into dist/
content/site.json   all page copy, photos (with alt text), address, phone, hours
content/menu.json   menu categories and prices
admin/              Decap CMS panel (/admin) that edits content/*.json
styles.css          design system (colors, type, layout, animation)
script.js           open/closed chip, menu tabs, mobile nav, scroll reveal
site.webmanifest    "Add to Home Screen" metadata
images/             real photos, pulled from Instagram @ganasdenomadacafe
netlify.toml        build command, publish dir, caching + security headers
```

Content is baked into the HTML at build time, so search engines and link previews see the real copy, and the structured data (hours, phone, address) always matches what the family entered in /admin. Every CMS save commits to `main`, which triggers a Netlify rebuild (about 30 seconds). If the content is invalid (e.g. hours not in 24h format), the build fails and the previous version stays live.

## Run it locally

Needs Node (any version from 12 up), no `npm install`:

```bash
node build.js
python3 -m http.server 8000 --directory dist
# then open http://localhost:8000
```

## Site URL

The canonical URL, Open Graph tags, JSON-LD, `robots.txt` and `sitemap.xml` all use Netlify's `URL` environment variable at build time (the site's primary URL). Renaming the Netlify site or attaching a custom domain only needs a redeploy, not a code change. Local builds fall back to `http://localhost:8000`.

## Images

On Netlify, `build.js` serves photos through the [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/) with responsive `srcset`s, so the original uploads (including new ones from /admin) are resized and converted to WebP/AVIF automatically. Locally, the originals are used as-is.

## Before you launch, please customize

- **Menu items and prices** in `content/menu.json` are still illustrative. Replace them with the real menu via /admin.
- **Hours**: confirm them with the family (they originally came from Google Maps, whose address turned out to be wrong).
- **Signature**: the page is signed "La familia Nómada". Swap in real first names if the family is comfortable with that.

## SEO notes

- A `CafeOrCoffeeShop` JSON-LD block in `<head>` (generated from `content/site.json`) gives Google structured data for name, address, phone and hours. That helps local search and Google Maps understand the business.
- Claim/verify the **Google Business Profile** for the shop if you haven't. It drives the Maps pin, reviews and the "open now" badge in search results, and matters more for local SEO than the website itself.

## Deploying to Netlify

The site used to live on GitHub Pages with a separate OAuth proxy on Vercel for the admin login. It's now all on Netlify instead, which also handles the admin panel's login for you — no separate proxy needed.

1. Push to the `main` branch (already done if you're reading this from the repo).
2. In [app.netlify.com](https://app.netlify.com), **Add new site → Import an existing project**, connect it to `Gerfier/nomada-cafe`.
3. Build settings come from `netlify.toml` (build command `node build.js`, publish directory `dist`), so you can leave the form as-is. Deploy.
4. Netlify assigns a random `*.netlify.app` URL. Rename it under **Site configuration → Site details → Change site name** (note: `nomada-cafe` is already taken by another business), or attach the real domain under **Domain management**. Then trigger a redeploy so the canonical/OG/sitemap URLs pick up the new address.
5. Turn on the admin login: **Site settings → Identity → Enable Identity**. Under **Identity → Registration**, set it to **Invite only** so strangers can't sign themselves up.
6. Turn on **Identity → Services → Git Gateway**. This is what lets Decap CMS commit changes to this repo on the family's behalf — they'll never need a GitHub account.
7. Invite the family: **Identity tab → Invite users**, enter their email(s). They get an email to set a password.
8. They log in at `https://<your-site>.netlify.app/admin/` with that email and password.

## Design notes

- Palette: espresso browns, warm cream, terracotta and gold accents — meant to feel like the inside of a warm cup, not a generic tech landing page.
- `Fraunces` (a soft, high-contrast serif) is used for all headlines to give a boutique, editorial feel; `Work Sans` keeps body copy legible and modern.
- Scroll-reveal animations and tilted "postcard" photos add movement without needing a JS framework. Content stays visible if JS fails, and motion respects `prefers-reduced-motion`.
- Fully responsive down to small phones, with a slide-in mobile nav and a bottom action bar (Llamar / WhatsApp / Cómo llegar).
