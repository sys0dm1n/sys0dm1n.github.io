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
