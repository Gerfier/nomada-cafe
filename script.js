// Content is edited via /admin (Decap CMS) into content/site.json and
// content/menu.json. If those can't be fetched (e.g. opened via file://,
// or offline), the site falls back to the copy baked in below so it never
// breaks — CMS is additive, not a hard dependency.
const FALLBACK_SITE = {
  hero: {
    tagline: 'Entras como desconocido, sales siendo familia.',
    lede: 'Todo viajero, tarde o temprano, necesita un lugar al cual volver. Camargo es nuestro punto de partida — y esta barra, nuestro campamento base.'
  },
  quienes: {
    p1: 'Nómada nació en nuestra propia mesa, entre pruebas de tueste y muchas tazas de más. Hoy seguimos siendo nosotros —la misma familia— quienes muelen el café, atienden las mesas y recuerdan cómo te gusta tu bebida.',
    p2: 'Cuando entras por esa puerta no eres un cliente número tal. Eres alguien a quien nos gusta ver seguido — y con el tiempo, ojalá, un poco de familia también.'
  },
  comunidad: {
    quote: 'Aquí no hay clientes de una sola vez. Si vienes una vez, la próxima ya sabemos cómo te gusta el café.',
    atribucion: 'Un mensaje de la familia Nómada',
    copy: 'Nómada también es el foro de Camargo: noches de música en vivo, club de lectura, arte local en las paredes y mercados de emprendedores. Si tienes una idea para reunir gente, aquí hay una mesa para ti.'
  },
  fotos: {
    sello: 'images/nomada-sello.png',
    principal: 'images/nomada-storefront-sign.jpg',
    quienes: 'images/nomada-chemex-pourover.jpg',
    menu: 'images/nomada-barista-back.jpg',
    postal1: 'images/nomada-canon-hike.jpg',
    postal2: 'images/nomada-laptop-drink.jpg',
    postal3: 'images/nomada-chemex-postal.jpg',
    postal4: 'images/nomada-cup-studio-bw.jpg'
  },
  contacto: {
    direccion: 'Allende 105, Col. Centro',
    ciudad: 'Ciudad Camargo, Chihuahua, C.P. 33700, México',
    telefono: '+526481469847',
    telefonoDisplay: '+52 648 146 9847',
    horario: { lunSabApertura: '7:00 am', lunSabCierre: '10:00 pm', domApertura: '9:00 am', domCierre: '10:00 pm' },
    facebook: 'https://www.facebook.com/nomadacafe/',
    instagram: 'https://www.instagram.com/ganasdenomadacafe/'
  }
};

const FALLBACK_MENU = {
  categorias: [
    { nombre: 'Espresso', items: [
      { nombre: 'Espresso', precio: '$35' }, { nombre: 'Americano', precio: '$40' },
      { nombre: 'Cortado', precio: '$45' }, { nombre: 'Cappuccino', precio: '$50' },
      { nombre: 'Latte', precio: '$52' }, { nombre: 'Mocha', precio: '$55' }
    ] },
    { nombre: 'Métodos', items: [
      { nombre: 'V60', precio: '$55' }, { nombre: 'Chemex', precio: '$60' },
      { nombre: 'Prensa francesa', precio: '$55' }, { nombre: 'Cold brew', precio: '$50' }
    ] },
    { nombre: 'Especiales', items: [
      { nombre: 'Nómada latte (canela y piloncillo)', precio: '$58' }, { nombre: 'Latte de temporada', precio: '$58' },
      { nombre: 'Chai latte', precio: '$52' }, { nombre: 'Chocolate caliente', precio: '$48' }
    ] },
    { nombre: 'Para acompañar', items: [
      { nombre: 'Pan dulce local', precio: '$25' }, { nombre: 'Waffles', precio: '$65' },
      { nombre: 'Bagel', precio: '$55' }, { nombre: 'Repostería artesanal', precio: '$35' }
    ] }
  ]
};

async function loadJSON(path, fallback) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('bad response');
    return await res.json();
  } catch (err) {
    return fallback;
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.textContent = value;
}

function applySiteContent(site) {
  setText('heroTagline', site.hero.tagline);
  setText('heroLede', site.hero.lede);
  setText('quienesP1', site.quienes.p1);
  setText('quienesP2', site.quienes.p2);
  setText('testimonialQuote', '“' + site.comunidad.quote + '”');
  setText('testimonialAttribution', site.comunidad.atribucion);
  setText('communityCopy', site.comunidad.copy);

  setText('visitDireccion', site.contacto.direccion);
  setText('visitCiudad', site.contacto.ciudad);

  const h = site.contacto.horario;
  setText('horarioLunSab', h.lunSabApertura + ' – ' + h.lunSabCierre);
  setText('horarioDom', h.domApertura + ' – ' + h.domCierre);

  const telDigits = (site.contacto.telefono || '').replace(/[^\d+]/g, '');
  const waDigits = telDigits.replace('+', '');
  const waMsg = 'Hola%20N%C3%B3mada%2C%20quiero%20preguntar%20algo';
  document.querySelectorAll('[data-tel-link]').forEach(el => {
    el.href = 'tel:' + telDigits;
    if (el.hasAttribute('data-tel-display')) el.textContent = site.contacto.telefonoDisplay;
  });
  document.querySelectorAll('[data-wa-link]').forEach(el => {
    el.href = 'https://wa.me/' + waDigits + '?text=' + waMsg;
  });
  document.querySelectorAll('[data-fb-link]').forEach(el => { el.href = site.contacto.facebook; });
  document.querySelectorAll('[data-ig-link]').forEach(el => { el.href = site.contacto.instagram; });

  applyFotos(site.fotos);

  return h;
}

// Each key maps a photo "slot" (a specific spot on the page, described by
// where it appears — not by what's currently in the picture, since the
// family can swap in a different drink/scene later) to the <img id> that
// shows it.
function applyFotos(fotos) {
  if (!fotos) return;
  const map = {
    sello: 'fotoSello',
    principal: 'fotoPrincipal',
    quienes: 'fotoQuienes',
    menu: 'fotoMenu',
    postal1: 'fotoPostal1',
    postal2: 'fotoPostal2',
    postal3: 'fotoPostal3',
    postal4: 'fotoPostal4'
  };
  Object.keys(map).forEach(key => {
    const el = document.getElementById(map[key]);
    if (el && fotos[key]) el.src = fotos[key];
  });
}

// "7:00 am" / "10:00 pm" -> decimal hour (0-24), for the open/closed check.
function parseClock(str) {
  const m = /(\d{1,2}):(\d{2})\s*(am|pm)/i.exec(String(str || ''));
  if (!m) return null;
  let hour = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) hour += 12;
  return hour + parseInt(m[2], 10) / 60;
}

function startStatusChip(horario) {
  const chip = document.getElementById('statusChip');
  const text = document.getElementById('statusText');
  if (!chip || !text) return;

  function update() {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const opens = parseClock(isSunday ? horario.domApertura : horario.lunSabApertura);
    const closes = parseClock(isSunday ? horario.domCierre : horario.lunSabCierre);
    const hour = now.getHours() + now.getMinutes() / 60;
    const isOpen = opens != null && closes != null && hour >= opens && hour < closes;

    chip.classList.toggle('is-closed', !isOpen);
    text.textContent = isOpen ? 'Abierto ahora' : 'Cerrado';
  }
  update();
  setInterval(update, 60 * 1000);
}

function renderMenu(menu) {
  const menuTabs = document.getElementById('menuTabs');
  const menuItems = document.getElementById('menuItems');
  const categorias = (menu && menu.categorias) || [];
  if (!menuTabs || !menuItems || !categorias.length) return;

  menuTabs.innerHTML = categorias.map((cat, i) => (
    '<button class="menu-tab' + (i === 0 ? ' is-active' : '') + '" data-cat="' + i + '" role="tab" aria-selected="' + (i === 0) + '">' +
      cat.nombre +
    '</button>'
  )).join('');

  function showCategory(i) {
    const cat = categorias[i];
    menuItems.innerHTML = (cat.items || []).map(item => (
      '<div class="menu-item">' +
        '<span class="menu-item-name">' + item.nombre + '</span>' +
        '<i class="menu-item-leader"></i>' +
        '<b class="menu-item-price">' + item.precio + '</b>' +
      '</div>'
    )).join('');
  }

  menuTabs.querySelectorAll('.menu-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      menuTabs.querySelectorAll('.menu-tab').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      showCategory(parseInt(btn.dataset.cat, 10));
    });
  });

  showCategory(0);
}

(async function init() {
  const [site, menu] = await Promise.all([
    loadJSON('content/site.json', FALLBACK_SITE),
    loadJSON('content/menu.json', FALLBACK_MENU)
  ]);
  const horario = applySiteContent(site);
  startStatusChip(horario);
  renderMenu(menu);
})();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal-on-scroll animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
