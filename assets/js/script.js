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
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
    ]);

    if (!userRes.ok) throw new Error('GitHub API error');

    const user  = await userRes.json();
    const repos = await reposRes.json();

    // Profile card
    document.getElementById('gh-avatar').src   = user.avatar_url ?? '';
    document.getElementById('gh-name').textContent   = (user.name || user.login || '—').toUpperCase();
    document.getElementById('gh-handle').textContent  = `@${user.login}`;
    document.getElementById('gh-bio').textContent     = user.bio || '';
    document.getElementById('gh-repos').textContent     = user.public_repos ?? '—';
    document.getElementById('gh-followers').textContent = user.followers     ?? '—';
    document.getElementById('gh-following').textContent = user.following    ?? '—';

    // Latest repository (most recently updated, excludes forks)
    renderLatestRepo(Array.isArray(repos) ? repos.find(r => !r.fork) || repos[0] : null);

    document.getElementById('gh-loading').style.display = 'none';
    document.getElementById('gh-data').style.display    = 'block';

    // Contribution calendar (separate, non-blocking fetch)
    loadContributionCalendar();

  } catch (e) {
    document.getElementById('gh-loading').style.display = 'none';
    document.getElementById('gh-error').style.display   = 'block';
  }
}

/* ── LATEST REPO CARD ── */
function renderLatestRepo(repo) {
  const el = document.getElementById('gh-latest-repo');
  if (!el) return;

  if (!repo) {
    el.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No public repositories yet.</p>';
    return;
  }

  const updated = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  el.innerHTML = `
    <div class="gh-repo-top">
      <div class="gh-repo-icon"><i class="fas fa-code-branch"></i></div>
      <div class="gh-repo-meta">
        <span><i class="far fa-star"></i> ${repo.stargazers_count}</span>
        <span><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>
      </div>
    </div>
    <a href="${repo.html_url}" target="_blank" class="gh-repo-name">${repo.name} <i class="fas fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i></a>
    <p class="gh-repo-desc">${repo.description || 'Public GitHub repository.'}</p>
    <div class="gh-repo-footer">
      <span class="gh-repo-lang">${repo.language ? `<span class="gh-repo-lang-dot"></span> ${repo.language}` : ''}</span>
      <span>Updated ${updated}</span>
    </div>
  `;
}

/* ── CONTRIBUTION CALENDAR ── */
async function loadContributionCalendar() {
  const grid = document.getElementById('gh-calendar');
  if (!grid) return;

  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`);
    if (!res.ok) throw new Error('Calendar API error');
    const data = await res.json();

    const days = (data.contributions || []).slice(-371); // ~53 weeks
    grid.innerHTML = days.map(d => {
      const dateLabel = new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `<div class="gh-day-cell" data-level="${d.level}" title="${d.count} contributions on ${dateLabel}"></div>`;
    }).join('');

  } catch (e) {
    grid.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Contribution calendar unavailable right now.</p>';
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