// Mobile menu toggle
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('[data-menu]');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) menu.setAttribute('data-open', '');
    else menu.removeAttribute('data-open');
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  // Close after a nav-link click (mobile only)
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();

// Scroll-spy: mark the current section's nav link
(function () {
  const sections = document.querySelectorAll('main section[id]');
  const links = new Map();
  document.querySelectorAll('.nav-menu a[href^="#"]').forEach((a) => {
    links.set(a.getAttribute('href').slice(1), a);
  });
  if (!sections.length || !links.size || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = links.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach((a) => a.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach((s) => io.observe(s));
})();

// Reveal-on-scroll: fade and lift sections as they enter view
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('main section, .role, .card');
  if (prefersReduced || !targets.length || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  targets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  targets.forEach((el) => io.observe(el));
})();
