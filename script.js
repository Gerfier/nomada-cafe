// Content is baked into the HTML at build time (see build.js); this file
// only handles interactive behavior.

const SHOP_TIME_ZONE = 'America/Chihuahua';

function minutesOf(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || '').trim());
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function shopNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHOP_TIME_ZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date());
  const get = type => (parts.find(p => p.type === type) || {}).value;
  return { weekday: get('weekday'), minutes: parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10) };
}

// A schedule whose closing time is at or before its opening time runs past
// midnight (e.g. 18:00–01:00); the early-morning hours belong to the
// previous day's schedule.
function isOpenNow(hours) {
  const now = shopNow();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days.indexOf(now.weekday);
  const yesterday = (today + 6) % 7;
  const scheduleFor = day => (day === 0 ? hours.dom : hours.lunSab);

  const [openT, closeT] = scheduleFor(today).map(minutesOf);
  if (openT != null && closeT != null) {
    if (closeT > openT ? (now.minutes >= openT && now.minutes < closeT) : now.minutes >= openT) return true;
  }
  const [openY, closeY] = scheduleFor(yesterday).map(minutesOf);
  return openY != null && closeY != null && closeY <= openY && now.minutes < closeY;
}

function startStatusChip() {
  const chip = document.getElementById('statusChip');
  const text = document.getElementById('statusText');
  if (!chip || !text) return;
  let hours;
  try { hours = JSON.parse(chip.dataset.hours); } catch (err) { return; }

  function update() {
    const open = isOpenNow(hours);
    chip.classList.remove('is-pending');
    chip.classList.toggle('is-closed', !open);
    text.textContent = open ? 'Abierto ahora' : 'Cerrado ahora';
  }
  update();
  setInterval(update, 60 * 1000);
}

function startMenuTabs() {
  const tablist = document.getElementById('menuTabs');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

  function select(tab, focus) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.classList.toggle('is-active', selected);
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', e => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next == null) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
}

function startMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('navLinks');
  if (!toggle || !nav) return;

  function setOpen(open, returnFocus) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) nav.querySelector('a').focus();
    else if (returnFocus) toggle.focus();
  }
  const isOpen = () => nav.classList.contains('is-open');

  toggle.addEventListener('click', () => setOpen(!isOpen(), false));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false, false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) setOpen(false, true);
  });
  document.addEventListener('click', e => {
    if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false, false);
  });
}

function startReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

startStatusChip();
startMenuTabs();
startMobileNav();
startReveal();
document.getElementById('year').textContent = new Date().getFullYear();
