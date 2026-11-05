// Renders content/site.json + content/menu.json into index.html and writes
// the publishable site to dist/. No dependencies: `node build.js`.
//
// The site's public URL (canonical, Open Graph, JSON-LD, sitemap) comes from
// Netlify's URL env var at build time, so renaming the Netlify site or
// attaching a custom domain needs no code change.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const COPY = ['styles.css', 'script.js', 'site.webmanifest', 'images', 'admin'];

const SITE_URL = (process.env.URL || 'http://localhost:8000').replace(/\/+$/, '');
const USE_IMAGE_CDN = process.env.NETLIFY === 'true';

const IMAGE_SLOTS = {
  sello: { widths: [96, 192], sizes: '86px', width: 86, height: 86 },
  principal: { widths: [480, 720, 960, 1280], sizes: '(max-width: 980px) min(420px, 90vw), 42vw', width: 900, height: 1125 },
  quienes: { widths: [480, 720, 960, 1280], sizes: '(max-width: 980px) 90vw, 45vw', width: 800, height: 1000 },
  menu: { widths: [320, 560], sizes: '280px', width: 280, height: 340 },
  postal1: { widths: [320, 480, 640], sizes: '(max-width: 760px) 220px, (max-width: 980px) 45vw, 25vw', width: 640, height: 480 }
};
IMAGE_SLOTS.postal2 = IMAGE_SLOTS.postal3 = IMAGE_SLOTS.postal4 = IMAGE_SLOTS.postal1;

const svg = (body, extra) => '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"' + (extra || '') + '>' + body + '</svg>';
const WA_OUTLINE = '<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>';
const ICONS = {
  whatsapp: svg(WA_OUTLINE + '<path d="M8.5 9.3c.3-1 1-1.2 1.4-1.2s.7 0 .9.5.7 1.7.8 1.8.1.3 0 .5-.2.3-.4.5-.4.4-.2.8c.2.4 1 1.6 2.1 2.2 1.1.7 1.3.6 1.6.5s.9-.9 1.1-1.2.5-.3.8-.2 1.8.8 2.1 1 .5.3.5.5-.1 1.2-.6 1.7-1.7 1.2-3 .7c-1.3-.5-3.5-1.8-4.7-3.7-.9-1.4-.9-2.6-.8-3Z" fill="currentColor"/>'),
  whatsappOutline: svg(WA_OUTLINE),
  phone: svg('<path d="M4 5c0-1 1-2 2-2h2l2 5-2 1.5a11 11 0 0 0 5.5 5.5L15 13l5 2v2c0 1-1 2-2 2C10.6 19 4 12.4 4 5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'),
  pin: svg('<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="2.4" stroke="currentColor" stroke-width="1.6"/>'),
  clock: svg('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
  facebook: svg('<path d="M15 8.5h2V5h-2c-2.2 0-4 1.8-4 4v2H9v3.5h2V21h3.5v-6.5H17l.5-3.5h-3V9c0-.5.4-.5.5-.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'),
  instagram: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/>')
};

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function sitePath(p) {
  return '/' + String(p).replace(/^\/+/, '');
}

function cdnUrl(p, width) {
  return '/.netlify/images?url=' + encodeURIComponent(sitePath(p)) + '&w=' + width + '&q=75';
}

function imgAttrs(slot, foto) {
  const cfg = IMAGE_SLOTS[slot];
  if (!foto || !foto.imagen) throw new Error('Falta la foto "' + slot + '" en content/site.json');
  const attrs = { alt: foto.alt || '', width: cfg.width, height: cfg.height };
  if (USE_IMAGE_CDN) {
    attrs.src = cdnUrl(foto.imagen, cfg.widths[cfg.widths.length - 1]);
    attrs.srcset = cfg.widths.map(w => cdnUrl(foto.imagen, w) + ' ' + w + 'w').join(', ');
    attrs.sizes = cfg.sizes;
  } else {
    attrs.src = sitePath(foto.imagen);
  }
  return Object.keys(attrs).map(k => k + '="' + escapeHtml(attrs[k]) + '"').join(' ');
}

function heroPreload(foto) {
  const cfg = IMAGE_SLOTS.principal;
  if (!USE_IMAGE_CDN) return '<link rel="preload" as="image" fetchpriority="high" href="' + escapeHtml(sitePath(foto.imagen)) + '">';
  const srcset = cfg.widths.map(w => cdnUrl(foto.imagen, w) + ' ' + w + 'w').join(', ');
  return '<link rel="preload" as="image" fetchpriority="high" imagesrcset="' + escapeHtml(srcset) + '" imagesizes="' + escapeHtml(cfg.sizes) + '">';
}

function checkTime(value, label) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value))) {
    throw new Error('Horario "' + label + '" debe estar en formato 24 horas (ej. 07:00), no "' + value + '"');
  }
  return value;
}

function displayTime(hhmm) {
  const parts = hhmm.split(':');
  const h = parseInt(parts[0], 10);
  return ((h % 12) || 12) + ':' + parts[1] + ' ' + (h < 12 ? 'am' : 'pm');
}

function renderMenu(menu) {
  const categorias = (menu.categorias || []).filter(c => c.items && c.items.length);
  if (!categorias.length) throw new Error('content/menu.json no tiene categorías con productos');
  const tabs = categorias.map((cat, i) =>
    '      <button class="menu-tab' + (i === 0 ? ' is-active' : '') + '" type="button" role="tab" id="menu-tab-' + i +
    '" aria-controls="menu-panel-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
    escapeHtml(cat.nombre) + '</button>'
  ).join('\n');
  const panels = categorias.map((cat, i) =>
    '      <div class="menu-list" role="tabpanel" id="menu-panel-' + i + '" aria-labelledby="menu-tab-' + i + '" tabindex="0"' + (i === 0 ? '' : ' hidden') + '>\n' +
    cat.items.map(item =>
      '        <div class="menu-item"><span class="menu-item-name">' + escapeHtml(item.nombre) +
      '</span><i class="menu-item-leader" aria-hidden="true"></i><b class="menu-item-price">' + escapeHtml(item.precio) + '</b></div>'
    ).join('\n') +
    '\n      </div>'
  ).join('\n');
  return { tabs, panels };
}

function buildJsonLd(site, ctx) {
  const c = site.contacto;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'Nómada Café de Especialidad',
    description: site.hero.tagline + ' Café de especialidad en ' + c.localidad + ', ' + c.estado + '.',
    image: ctx.ogImage,
    url: ctx.pageUrl,
    telephone: c.telefono,
    priceRange: '$',
    servesCuisine: 'Café de especialidad',
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.direccion,
      addressLocality: c.localidad,
      addressRegion: c.estado,
      postalCode: c.cp,
      addressCountry: 'MX'
    },
    sameAs: [c.facebook, c.instagram],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: c.horario.lunSabApertura, closes: c.horario.lunSabCierre },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: c.horario.domApertura, closes: c.horario.domCierre }
    ]
  }, null, 2).replace(/</g, '\\u003c');
}

function buildContext(site, menu) {
  const c = site.contacto;
  const h = c.horario;
  ['lunSabApertura', 'lunSabCierre', 'domApertura', 'domCierre'].forEach(k => checkTime(h[k], k));

  const telDigits = String(c.telefono).replace(/[^\d+]/g, '');
  const placeQuery = 'Nómada café de especialidad, ' + c.direccion + ', ' + c.localidad + ', ' + c.estado;
  const img = {};
  Object.keys(IMAGE_SLOTS).forEach(slot => { img[slot] = imgAttrs(slot, site.fotos[slot]); });
  const rendered = renderMenu(menu);

  const ctx = Object.assign({}, site, {
    contacto: Object.assign({}, c, {
      localidadCorta: c.localidad.replace(/^Ciudad\s+/i, ''),
      direccionCorta: c.direccion.replace(/\bCol(onia)?\.?\s+/i, '')
    }),
    pageUrl: SITE_URL + '/',
    ogImage: SITE_URL + sitePath(site.fotos.quienes.imagen),
    ciudadDisplay: c.localidad + ', ' + c.estado + ', C.P. ' + c.cp + ', México',
    telUrl: 'tel:' + telDigits,
    waUrl: 'https://wa.me/' + telDigits.replace('+', '') + '?text=' + encodeURIComponent('Hola Nómada, quiero preguntar algo'),
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(placeQuery),
    mapsEmbedUrl: 'https://www.google.com/maps?q=' + encodeURIComponent(placeQuery) + '&output=embed',
    instagramHandle: String(c.instagram).replace(/\/+$/, '').split('/').pop(),
    horarioLunSab: displayTime(h.lunSabApertura) + ' – ' + displayTime(h.lunSabCierre),
    horarioDom: displayTime(h.domApertura) + ' – ' + displayTime(h.domCierre),
    hoursJson: JSON.stringify({ lunSab: [h.lunSabApertura, h.lunSabCierre], dom: [h.domApertura, h.domCierre] }),
    year: new Date().getFullYear(),
    img: img,
    icons: ICONS,
    menuTabs: rendered.tabs,
    menuPanels: rendered.panels,
    heroPreload: heroPreload(site.fotos.principal)
  });
  ctx.jsonLd = buildJsonLd(site, ctx);
  return ctx;
}

function lookup(ctx, key) {
  const value = key.split('.').reduce((obj, k) => (obj == null ? undefined : obj[k]), ctx);
  if (value == null) throw new Error('index.html usa {{' + key + '}} pero no existe en el contenido');
  return value;
}

function render(template, ctx) {
  return template
    .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (m, key) => String(lookup(ctx, key)))
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => escapeHtml(lookup(ctx, key)));
}

function copy(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(name => copy(path.join(src, name), path.join(dest, name)));
  } else {
    fs.copyFileSync(src, dest);
  }
}

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    fs.readdirSync(p).forEach(name => rmrf(path.join(p, name)));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

function main() {
  const ctx = buildContext(readJSON('content/site.json'), readJSON('content/menu.json'));
  rmrf(OUT);
  fs.mkdirSync(OUT, { recursive: true });
  COPY.forEach(name => copy(path.join(ROOT, name), path.join(OUT, name)));

  fs.writeFileSync(path.join(OUT, 'index.html'), render(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), ctx));
  fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ' + SITE_URL + '/sitemap.xml\n');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '  <url>\n    <loc>' + escapeHtml(ctx.pageUrl) + '</loc>\n    <lastmod>' + new Date().toISOString().slice(0, 10) + '</lastmod>\n  </url>\n</urlset>\n');

  console.log('Built dist/ for ' + SITE_URL + (USE_IMAGE_CDN ? ' (Netlify Image CDN on)' : ''));
}

main();
