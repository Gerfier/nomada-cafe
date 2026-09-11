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
- `robots.txt` + `sitemap.xml` are included; if you move off `gerfier.github.io`, update the canonical URL, `og:url`, and the URLs inside both files to match the new domain.
- `site.webmanifest` has `start_url` set to `/nomada-cafe/` (the current GitHub Pages subpath). If you move to a custom domain at the root, change it to `/`.
- Claim/verify the **Google Business Profile** for the shop if you haven't — it's what actually drives the Maps pin, reviews, and "open now" badge in search results, and matters more for local SEO than the website itself.

## Deploying to GitHub Pages

1. Push to the `main` branch (already done if you're reading this from the repo).
2. In the repo settings → **Pages**, set source to `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. The site will publish at `https://<your-username>.github.io/<repo-name>/`.

## Design notes

- Palette: espresso browns, warm cream, terracotta and gold accents — meant to feel like the inside of a warm cup, not a generic tech landing page.
- `Fraunces` (a soft, high-contrast serif) is used for all headlines to give a boutique, editorial feel; `Work Sans` keeps body copy legible and modern.
- Scroll-reveal animations, a marquee ticker, and a tilted photo collage add movement without needing a JS framework.
- Fully responsive down to small phones, with a slide-in mobile nav.
