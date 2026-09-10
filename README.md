# Nómada — Café de Especialidad

A single-page marketing site for **Nómada Café de Especialidad**, a specialty coffee shop in Ciudad Camargo, Chihuahua, México.

Live info used to build this: 5.0★ rated, #1 coffee spot in Ciudad Camargo (Tripadvisor), located at Felipe Ángeles 902-B, Col. San Isidro, open daily.

## Stack

Plain HTML/CSS/JS — no build step, no dependencies. Fonts load from Google Fonts (`Fraunces` for display type, `Work Sans` for body copy).

```
index.html      structure & copy
styles.css      design system (colors, type, layout, animation)
script.js       nav, scroll reveal, gallery lightbox, newsletter form
favicon.svg     coffee-cup mark used as the tab icon
```

## Run it locally

No build tools needed — any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Before you launch — please customize

This ships with **stock photography** (Unsplash) as placeholders so the layout and vibe are visible immediately. Swap these for real photos of the shop, drinks, and space before going live — it'll make a huge difference:

- Hero background (`.hero-bg` in `index.html`)
- "Nuestra historia" photo
- Community collage (3 photos)
- Gallery grid (6 photos)

Also double-check / update:

- **Menu items & prices** in the `#menu` section — these are illustrative placeholders.
- **Instagram link** in the footer/visit section — currently points to instagram.com generically; add the real handle.
- **Newsletter form** — currently front-end only (shows a "¡Gracias!" confirmation but doesn't send anywhere). Wire it to Mailchimp, Buttondown, a Google Form, or similar.
- **Hours/phone/address** — pulled from the current Google Maps / Tripadvisor listing; confirm they're still accurate.

## Deploying to GitHub Pages

1. Push to the `main` branch (already done if you're reading this from the repo).
2. In the repo settings → **Pages**, set source to `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. The site will publish at `https://<your-username>.github.io/<repo-name>/`.

## Design notes

- Palette: espresso browns, warm cream, terracotta and gold accents — meant to feel like the inside of a warm cup, not a generic tech landing page.
- `Fraunces` (a soft, high-contrast serif) is used for all headlines to give a boutique, editorial feel; `Work Sans` keeps body copy legible and modern.
- Scroll-reveal animations, a marquee ticker, and a tilted photo collage add movement without needing a JS framework.
- Fully responsive down to small phones, with a slide-in mobile nav.
