// "Abierto ahora" status chip — computed client-side against store hours
// Mon–Sat 7:00–22:00, Sun 9:00–22:00
function updateStatus() {
  const chip = document.getElementById('statusChip');
  const text = document.getElementById('statusText');
  if (!chip || !text) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday .. 6 = Saturday
  const hour = now.getHours() + now.getMinutes() / 60;
  const opens = day === 0 ? 9 : 7;
  const closes = 22;
  const isOpen = hour >= opens && hour < closes;

  chip.classList.toggle('is-closed', !isOpen);
  text.textContent = isOpen ? 'Abierto ahora' : 'Cerrado';
}
updateStatus();
setInterval(updateStatus, 60 * 1000);

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

// Menu tabs
const MENU = {
  'Espresso': [
    ['Espresso', '$35'],
    ['Americano', '$40'],
    ['Cortado', '$45'],
    ['Cappuccino', '$50'],
    ['Latte', '$52'],
    ['Mocha', '$55']
  ],
  'Métodos': [
    ['V60', '$55'],
    ['Chemex', '$60'],
    ['Prensa francesa', '$55'],
    ['Cold brew', '$50']
  ],
  'Especiales': [
    ['Nómada latte <em>(canela y piloncillo)</em>', '$58'],
    ['Latte de temporada', '$58'],
    ['Chai latte', '$52'],
    ['Chocolate caliente', '$48']
  ],
  'Para acompañar': [
    ['Pan dulce local', '$25'],
    ['Waffles', '$65'],
    ['Bagel', '$55'],
    ['Repostería artesanal', '$35']
  ]
};

const menuTabs = document.getElementById('menuTabs');
const menuItems = document.getElementById('menuItems');

function renderMenu(tab) {
  const list = MENU[tab] || [];
  menuItems.innerHTML = list.map(([name, price]) => (
    '<div class="menu-item">' +
      '<span class="menu-item-name">' + name + '</span>' +
      '<i class="menu-item-leader"></i>' +
      '<b class="menu-item-price">' + price + '</b>' +
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
    renderMenu(btn.dataset.tab);
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
