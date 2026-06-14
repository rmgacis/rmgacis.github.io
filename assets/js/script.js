/* ============================================================
   PORTFOLIO — script.js
   GitHub Live Data · Scroll Reveal · Skill Bars · Active Nav · Contact
   ============================================================ */

/* ── CONFIG ── */
const GITHUB_USERNAME = 'rmgacis'; // ← CHANGE THIS to your GitHub username

/* ── GITHUB LIVE DATA ── */
async function loadGitHub() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
    ]);

    if (!userRes.ok) throw new Error('GitHub API error');

    const user  = await userRes.json();
    const repos = await reposRes.json();
    const stars = Array.isArray(repos)
      ? repos.reduce((sum, r) => sum + r.stargazers_count, 0)
      : 0;

    document.getElementById('gh-repos').textContent     = user.public_repos ?? '—';
    document.getElementById('gh-followers').textContent = user.followers     ?? '—';
    document.getElementById('gh-following').textContent = user.following     ?? '—';
    document.getElementById('gh-stars').textContent     = stars;

    document.getElementById('gh-loading').style.display = 'none';
    document.getElementById('gh-data').style.display    = 'block';

    // Animate the contributions bar after a short delay
    setTimeout(() => {
      const bar = document.getElementById('gh-contrib-bar');
      if (bar) bar.style.width = '82%';
    }, 400);

  } catch (e) {
    document.getElementById('gh-loading').style.display = 'none';
    document.getElementById('gh-error').style.display   = 'block';
  }
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const reveals   = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObs.observe(el));
}

/* ── SKILL BARS ── */
function initSkillBars() {
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('#techstack .col-lg-8').forEach(el => barObs.observe(el));
}

/* ── ACTIVE NAV HIGHLIGHT ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObs.observe(s));
}

/* ── CONTACT FORM ── */
function sendMessage() {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const status  = document.getElementById('cf-status');

  if (!name || !email || !message) {
    status.style.display = 'block';
    status.style.color   = '#ff6b6b';
    status.innerHTML     = '<i class="fas fa-exclamation-circle me-1"></i> Please fill in all required fields.';
    return;
  }

  const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const mailSubj = encodeURIComponent(subject || 'Portfolio Contact');

  // Opens the user's default mail client
  window.location.href = `mailto:ronaldmischa@gmail.com?subject=${mailSubj}&body=${mailBody}`;

  status.style.display = 'block';
  status.style.color   = '#22d3a0';
  status.innerHTML     = '<i class="fas fa-check-circle me-1"></i> Opening your mail client…';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  loadGitHub();
  initScrollReveal();
  initSkillBars();
  initActiveNav();
});
/* ── BACK TO TOP ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
}

document.addEventListener('DOMContentLoaded', initBackToTop);