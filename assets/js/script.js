function initActiveNav() {
  const links = document.querySelectorAll('.rail nav a, .menu a');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => obs.observe(s));
}

function initMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;
  const set = open => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  };
  btn.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
}

function sendMessage() {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const status  = document.getElementById('cf-status');

  status.style.display = 'block';
  if (!name || !email || !message) {
    status.style.color = '#ff6b6b';
    status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in your name, email, and message.';
    return;
  }

  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const subj = encodeURIComponent(subject || 'Portfolio Contact');
  window.location.href = `mailto:ronaldmischa@gmail.com?subject=${subj}&body=${body}`;

  status.style.color = '#22d3a0';
  status.innerHTML = '<i class="fas fa-check-circle"></i> Opening your mail client…';
}

function initReveal() {
  const targets = document.querySelectorAll(
    'main .lead, main .sec-head, main .sub-title, main .card, main .about > div > p'
  );
  if (!('IntersectionObserver' in window)) return;

  const counts = new Map();
  targets.forEach(el => {
    const parent = el.parentElement;
    const i = counts.get(parent) || 0;
    counts.set(parent, i + 1);
    el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
    el.classList.add('reveal');
  });

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      o.unobserve(el);
      el.addEventListener('transitionend', function done(e) {
        if (e.propertyName !== 'opacity') return;
        el.classList.remove('reveal', 'in');
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', done);
      });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initMenu();
  initBackToTop();
  initReveal();
});

function initThemeToggle() {
  const root = document.documentElement;
  const toggles = document.querySelectorAll('.theme-toggle');
  const updateButtons = () => {
    const light = root.dataset.theme === 'light';
    toggles.forEach(btn => {
      const label = light ? 'Switch to dark mode' : 'Switch to light mode';
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.querySelector('i').className = light ? 'fas fa-moon' : 'fas fa-sun';
      const text = btn.querySelector('.theme-toggle-label');
      if (text) text.textContent = light ? 'Dark mode' : 'Light mode';
    });
  };
  toggles.forEach(btn => btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
    updateButtons();
  }));
  updateButtons();
}
document.addEventListener('DOMContentLoaded', initThemeToggle);
