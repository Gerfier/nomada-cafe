# Nómada — Café de Especialidad

A single-page marketing site for **Nómada Café de Especialidad**, a specialty coffee shop in Ciudad Camargo, Chihuahua, México.

Live info used to build this: 5.0★ rated, #1 coffee spot in Ciudad Camargo (Tripadvisor), open daily, located at Allende 105, Col. Centro (per their Instagram [@ganasdenomadacafe](https://www.instagram.com/ganasdenomadacafe/) — this superseded an earlier, incorrect address sourced from Google Maps).

## Stack

Plain HTML/CSS/JS — no build step, no dependencies. Fonts load from Google Fonts (`Fraunces` for display type, `Work Sans` for body copy).

```
index.html          structure & copy
styles.css          design system (colors, type, layout, animation)
script.js           nav, scroll reveal, gallery lightbox, newsletter form
favicon.svg         coffee-cup mark used as the tab icon
site.webmanifest     "Add to Home Screen" metadata
robots.txt          crawler access (points to sitemap.xml)
sitemap.xml         single-URL sitemap for search engines
images/             real photos, pulled from Instagram @ganasdenomadacafe
```

## Run it locally

No build tools needed — any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Before you launch — please customize

All photos are now real — pulled from their Instagram ([@ganasdenomadacafe](https://www.instagram.com/ganasdenomadacafe/)) and saved locally under `images/`, not hotlinked (Instagram's CDN blocks that; links 403 within minutes). Menu copy is still illustrative.

- **`#familia` section** — currently signed "La familia Nómada." Swap in real first names if the family is comfortable with that; it's a small change that makes the note feel even more personal.
- **Menu items & prices** in the `#menu` section — these are illustrative placeholders, not their real menu.
- **Newsletter form** — currently front-end only (shows a "¡Gracias!" confirmation but doesn't send anywhere). Wire it to Mailchimp, Buttondown, a Google Form, or similar.
- **Hours** — still from the original Google Maps listing; worth confirming now that the address itself turned out to be wrong.
- **More photos** — if the family wants a fuller gallery or a proper carousel, save more images directly from the Instagram app (there's no way to fetch them programmatically) and drop them in `images/`.

## SEO notes

- A `CafeOrCoffeeShop` JSON-LD block in `<head>` gives Google structured data for name, address, phone, geo-coordinates and hours — this is what helps local search and Google Maps understand the business, separate from ranking on organic search text.
- `robots.txt` + `sitemap.xml` are included with a placeholder `https://nomada-cafe.netlify.app/` URL. Once the site is deployed (or a custom domain is attached), update the canonical URL, `og:url`/`og:image`/`twitter:image` in `index.html`, and the URLs inside both files to match the real one.
- `site.webmanifest`'s `start_url` is `/` (Netlify serves the site from the root, unlike the old GitHub Pages subpath).
- Claim/verify the **Google Business Profile** for the shop if you haven't — it's what actually drives the Maps pin, reviews, and "open now" badge in search results, and matters more for local SEO than the website itself.

## Deploying to Netlify

The site used to live on GitHub Pages with a separate OAuth proxy on Vercel for the admin login. It's now all on Netlify instead, which also handles the admin panel's login for you — no separate proxy needed.

1. Push to the `main` branch (already done if you're reading this from the repo).
2. In [app.netlify.com](https://app.netlify.com), **Add new site → Import an existing project**, connect it to `Gerfier/nomada-cafe`.
3. Build settings: leave the **build command** empty and set the **publish directory** to `.` (this repo ships a `netlify.toml` that already sets this, so Netlify should pick it up automatically). Deploy.
4. Netlify assigns a `*.netlify.app` URL — rename it under **Site settings → Site details → Change site name**, or attach the real domain later under **Domain management**. Once you know the final URL, update the placeholder `https://nomada-cafe.netlify.app/` references (see SEO notes above).
5. Turn on the admin login: **Site settings → Identity → Enable Identity**. Under **Identity → Registration**, set it to **Invite only** so strangers can't sign themselves up.
6. Turn on **Identity → Services → Git Gateway**. This is what lets Decap CMS commit changes to this repo on the family's behalf — they'll never need a GitHub account.
7. Invite the family: **Identity tab → Invite users**, enter their email(s). They get an email to set a password.
8. They log in at `https://<your-site>.netlify.app/admin/` with that email and password.

## Design notes

- Palette: espresso browns, warm cream, terracotta and gold accents — meant to feel like the inside of a warm cup, not a generic tech landing page.
- `Fraunces` (a soft, high-contrast serif) is used for all headlines to give a boutique, editorial feel; `Work Sans` keeps body copy legible and modern.
- Scroll-reveal animations, a marquee ticker, and a tilted photo collage add movement without needing a JS framework.
- Fully responsive down to small phones, with a slide-in mobile nav.
