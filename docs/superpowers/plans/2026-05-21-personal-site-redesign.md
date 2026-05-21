# Personal Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Jekyll/hacker-theme CV at sys0dm1n.github.io with a single-page Executive Light personal landing site, including a bot-safe "Book a meeting" CTA wired to a Proton Calendar URL.

**Architecture:** Multi-file static site served by GitHub Pages with `.nojekyll`. `index.html` holds all semantic content. `css/style.css` defines design tokens and layout. `js/main.js` adds the mobile-menu toggle, scroll-spy active nav link, and `prefers-reduced-motion`-gated reveal-on-scroll. No frameworks, no build step, no third-party JS except the existing Google Analytics tag.

**Tech Stack:** HTML5, CSS3 (custom properties, IntersectionObserver-driven progressive enhancement via vanilla JS), system font stack, Google Analytics (`G-XH22477GS5`).

**Spec:** [docs/superpowers/specs/2026-05-21-personal-site-redesign-design.md](../specs/2026-05-21-personal-site-redesign-design.md)

**Branch:** `redesign/executive-light` (already created off `master`).

---

## Setup

Before starting tasks, confirm working directory and branch, and start a local server in a separate terminal so each task can verify by browser/curl.

```bash
cd /Users/alain/scm/sys0dm1n/sys0dm1n.github.io
git branch --show-current      # expect: redesign/executive-light
python3 -m http.server 8080    # leave running in a second terminal
# Browser: http://localhost:8080/
```

**Note on TDD:** The spec deliberately ships without an automated test suite (it's a single static page). Each task therefore ends with a **deterministic verification command** — `curl | grep`, a file existence check, a Lighthouse run, or a visual browser check — before commit. This is the project's equivalent of "test passes".

---

## File map

| File | Created in | Purpose |
|---|---|---|
| `index.html` | Task 1, extended each section task | Single semantic page |
| `css/style.css` | Task 2, extended each section task | Executive Light tokens + layout |
| `js/main.js` | Task 11 | Mobile menu, scroll-spy, reveal |
| `.nojekyll` | Task 1 | Disable Jekyll on GitHub Pages |
| `404.html` | Task 16 | On-brand 404 |
| `favicon.svg` | Task 14 | AC monogram |
| `og-image.png` | Task 15 | 1200×630 social preview |
| `_config.yml` | Task 1 — **removed** | Old Jekyll config |
| `index.md` | Task 1 — **removed** | Old CV |

---

### Task 1: Bootstrap — remove Jekyll, create static scaffold

**Files:**
- Delete: `_config.yml`, `index.md`
- Create: `.nojekyll`, `index.html`, `css/style.css`, `js/main.js`

- [ ] **Step 1: Remove Jekyll config and the old CV markdown**

```bash
git rm _config.yml index.md
```

- [ ] **Step 2: Create `.nojekyll`** (empty file — its presence is the signal)

```bash
touch .nojekyll
```

- [ ] **Step 3: Create the empty stylesheet and script** so HTML references resolve

```bash
mkdir -p css js
: > css/style.css
: > js/main.js
```

- [ ] **Step 4: Write `index.html` shell**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Alain C. — DevOps Team Lead</title>
  <meta name="description" content="DevOps Team Lead with 10+ years building reliable cloud platforms and the teams behind them. AWS · Kubernetes · Terraform.">
  <link rel="stylesheet" href="css/style.css">

  <!-- Google Analytics (existing tag) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XH22477GS5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XH22477GS5');
  </script>
</head>
<body id="top">
  <!--
    BOOKING_URL: https://calendar.proton.me/bookings#Dv2Q_7jlUkUFkPm_nYaAfuSyQcXUWxr8x0z3WEYh89g=
    Update in one place: all "Book a meeting" anchors below.
  -->
  <main>
    <p>Site under construction.</p>
  </main>
  <script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 5: Verify the local server serves the new page**

```bash
curl -s http://localhost:8080/ | grep -F "Alain C. — DevOps Team Lead"
```
Expected: matching `<title>` line printed.

```bash
ls -1 _config.yml index.md 2>&1 | grep -F "No such file"
```
Expected: both reported missing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Bootstrap static site, remove Jekyll, scaffold files"
```

---

### Task 2: CSS foundation — tokens, reset, base typography

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Write the foundation styles** (overwrite the empty file)

```css
/* === Design tokens =========================================== */
:root {
  --bg: #ffffff;
  --surface: #f8fafc;
  --text: #0f172a;
  --muted: #475569;
  --hairline: #e2e8f0;
  --accent: #1d4ed8;
  --accent-ink: #ffffff;

  --maxw: 760px;
  --pad-x: clamp(20px, 5vw, 32px);
  --pad-section: clamp(56px, 9vw, 96px);

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, system-ui, sans-serif;
}

/* === Reset =================================================== */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, svg { max-width: 100%; display: block; }
ul { margin: 0; padding: 0; list-style: none; }
button { font: inherit; cursor: pointer; }

/* === Typography ============================================== */
h1, h2, h3 { letter-spacing: -0.01em; margin: 0; line-height: 1.2; }
h1 { font-size: clamp(40px, 6vw, 56px); font-weight: 700; }
h2 { font-size: clamp(24px, 3.4vw, 30px); font-weight: 600; margin-bottom: 24px; }
h3 { font-size: 18px; font-weight: 600; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 600;
}
.muted { color: var(--muted); }

/* === Layout primitives ======================================= */
.container {
  max-width: var(--maxw);
  margin: 0 auto;
  padding-left: var(--pad-x);
  padding-right: var(--pad-x);
}
section { padding-top: var(--pad-section); padding-bottom: var(--pad-section); }
section + section { border-top: 1px solid var(--hairline); }

/* === Buttons ================================================= */
.btn {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.2;
  border: 1px solid transparent;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}
.btn:hover { text-decoration: none; }
.btn-primary { background: var(--accent); color: var(--accent-ink); }
.btn-primary:hover { background: #1e40af; }
.btn-secondary { background: transparent; color: var(--text); border-color: var(--hairline); }
.btn-secondary:hover { border-color: #cbd5e1; }

/* === Focus =================================================== */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

/* === Utility ================================================= */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* === Motion preferences ====================================== */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify the page still loads cleanly** with no console errors

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/css/style.css
```
Expected: `200`.

Open `http://localhost:8080/` in the browser; the placeholder paragraph should now render in the new font stack on a white background.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Add Executive Light CSS foundation: tokens, reset, type"
```

---

### Task 3: Sticky navigation (HTML + CSS, no JS yet)

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Replace the placeholder `<main>` with the header + an empty `<main>`**

Find `<main>` in `index.html` and replace the **entire** `<main>…</main>` block with this header followed by an empty `<main>`:

```html
  <header class="site-header" aria-label="Site">
    <div class="container nav">
      <a class="brand" href="#top">Alain C.</a>

      <button class="nav-toggle" type="button"
              aria-controls="nav-menu" aria-expanded="false" aria-label="Open menu">
        <span class="nav-toggle-bar" aria-hidden="true"></span>
        <span class="nav-toggle-bar" aria-hidden="true"></span>
      </button>

      <ul id="nav-menu" class="nav-menu" data-menu>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <a class="btn btn-primary nav-cta"
         href="https://calendar.proton.me/bookings#Dv2Q_7jlUkUFkPm_nYaAfuSyQcXUWxr8x0z3WEYh89g="
         target="_blank" rel="noopener noreferrer">Book a meeting</a>
    </div>
  </header>

  <main>
  </main>
```

- [ ] **Step 2: Append the nav styles to `css/style.css`**

```css
/* === Site header / nav ======================================= */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  border-bottom: 1px solid var(--hairline);
}
.nav {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 60px;
  max-width: 960px; /* slightly wider than content so CTA breathes */
}
.brand {
  color: var(--text);
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.01em;
}
.brand:hover { text-decoration: none; }

.nav-menu {
  display: flex;
  gap: 22px;
  margin-left: auto;
}
.nav-menu a {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}
.nav-menu a:hover { color: var(--text); text-decoration: none; }
.nav-menu a[aria-current="true"] { color: var(--text); }

.nav-cta { font-size: 14px; padding: 8px 14px; }

.nav-toggle {
  display: none;
  margin-left: auto;
  background: transparent;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  padding: 8px 10px;
  align-items: center;
  gap: 4px;
}
.nav-toggle-bar {
  width: 18px; height: 2px; background: var(--text); display: block;
}
.nav-toggle-bar + .nav-toggle-bar { margin-top: 4px; }

/* Mobile */
@media (max-width: 720px) {
  .nav-toggle { display: inline-flex; flex-direction: column; }
  .nav-menu {
    position: absolute;
    top: 60px; left: 0; right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--bg);
    border-bottom: 1px solid var(--hairline);
    padding: 8px 0;
    display: none;
  }
  .nav-menu[data-open] { display: flex; }
  .nav-menu a { display: block; padding: 12px var(--pad-x); }
  .nav-cta { order: 3; }
}
```

- [ ] **Step 3: Verify the nav renders and the CTA target is correct**

```bash
curl -s http://localhost:8080/ | grep -F "calendar.proton.me/bookings#Dv2Q_7jlUkUFkPm_nYaAfuSyQcXUWxr8x0z3WEYh89g="
```
Expected: one matching line.

In the browser at `http://localhost:8080/`, confirm: brand on the left, four nav links in the middle, blue "Book a meeting" button on the right. Resize narrower than 720px — links collapse (the hamburger button shows but doesn't open yet; we wire it in Task 11).

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add sticky nav with Book-a-meeting CTA"
```

---

### Task 4: Hero section

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Insert the hero inside `<main>`** — keep the empty `<main></main>` and add this as its first child

```html
    <section class="hero" aria-labelledby="hero-title">
      <div class="container">
        <p class="eyebrow">DevOps Team Lead</p>
        <h1 id="hero-title">Alain C.</h1>
        <p class="hero-sub">Building reliable cloud platforms and the teams behind them.</p>
        <p class="hero-meta">Beirut · Berlin · 10+ years</p>

        <ul class="chips" aria-label="Core technologies">
          <li>AWS</li><li>Kubernetes</li><li>Terraform</li>
          <li>Docker</li><li>Ansible</li><li>Linux</li>
        </ul>

        <div class="hero-cta">
          <a class="btn btn-primary"
             href="https://calendar.proton.me/bookings#Dv2Q_7jlUkUFkPm_nYaAfuSyQcXUWxr8x0z3WEYh89g="
             target="_blank" rel="noopener noreferrer">Book a meeting</a>
          <a class="btn btn-secondary"
             href="https://www.linkedin.com/in/alainch"
             target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append hero styles to `css/style.css`**

```css
/* === Hero ==================================================== */
.hero { padding-top: calc(var(--pad-section) + 16px); padding-bottom: var(--pad-section); }
.hero .eyebrow { margin-bottom: 14px; }
.hero h1 { margin-bottom: 14px; }
.hero-sub {
  font-size: clamp(18px, 2.2vw, 22px);
  color: var(--text);
  max-width: 620px;
  margin: 0 0 10px;
}
.hero-meta { color: var(--muted); font-size: 15px; margin: 0 0 28px; }

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin: 0 0 32px;
}
.chips li {
  font-size: 13px;
  color: var(--muted);
  border: 1px solid var(--hairline);
  background: var(--surface);
  border-radius: 999px;
  padding: 4px 10px;
}

.hero-cta { display: flex; flex-wrap: wrap; gap: 10px; }

/* Hero has no top divider (it follows the sticky header) */
.hero + section { border-top: 1px solid var(--hairline); }
.hero { border-top: 0; }
```

- [ ] **Step 3: Verify the hero renders with the correct copy**

```bash
curl -s http://localhost:8080/ | grep -F "Building reliable cloud platforms and the teams behind them."
```
Expected: one matching line.

In the browser: hero shows eyebrow, large name, positioning sentence, location/years meta line, 6 chips, and two CTAs (blue primary + outline secondary). The "Book a meeting" anchor opens in a new tab.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add hero section"
```

---

### Task 5: About section + stats strip

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Append after the hero `<section>` (still inside `<main>`)**

```html
    <section id="about" aria-labelledby="about-title">
      <div class="container">
        <h2 id="about-title">About</h2>
        <p>
          Dynamic, results-driven DevOps Team Lead with 10+ years leading
          technical teams and optimising cloud infrastructure. Adept across
          Kubernetes, Ansible, Terraform, AWS, and GitLab CI/CD. Focused on
          managing cross-functional teams, improving automation workflows, and
          building resilient systems that support reliable, scalable operations.
        </p>

        <dl class="stats" aria-label="At a glance">
          <div><dt>10+</dt><dd>years</dd></div>
          <div><dt>4</dt><dd>teams led</dd></div>
          <div><dt>3</dt><dd>languages</dd></div>
          <div><dt>3</dt><dd>certifications</dd></div>
        </dl>
      </div>
    </section>
```

- [ ] **Step 2: Append stats styles to `css/style.css`**

```css
/* === About / stats =========================================== */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 32px 0 0;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: 12px;
}
.stats > div { display: flex; flex-direction: column; gap: 2px; }
.stats dt { font-size: 28px; font-weight: 700; color: var(--text); }
.stats dd { margin: 0; color: var(--muted); font-size: 14px; }

@media (max-width: 560px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:8080/ | grep -F 'id="about-title"'
```
Expected: one matching line.

Browser: About section appears below the hero with a subdivider hairline, summary paragraph, and a 4-up stats strip that wraps to 2×2 below 560px.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add About section with stats strip"
```

---

### Task 6: Selected highlights (2×2 impact grid)

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Append after the About section (inside `<main>`)**

```html
    <section id="highlights" aria-labelledby="highlights-title">
      <div class="container">
        <h2 id="highlights-title">Selected highlights</h2>
        <ul class="cards">
          <li class="card">
            <h3>Cut deployment time &amp; AWS cost</h3>
            <p>Optimised infrastructure and consolidated databases at serVme, reducing deploy time and recurring spend.</p>
          </li>
          <li class="card">
            <h3>EKS + GitOps migration</h3>
            <p>Moved a traditional architecture to fully automated CI/CD pipelines on Amazon EKS with Jenkins and GitOps.</p>
          </li>
          <li class="card">
            <h3>Hybrid-cloud migration</h3>
            <p>Migrated services to a hybrid architecture spanning AWS, OVH, and Heroku, with caching via Redis and Varnish.</p>
          </li>
          <li class="card">
            <h3>Built &amp; led DevOps teams</h3>
            <p>Recruitment, daily standups, retrospectives, and 1:1s across multiple teams at doctorly and serVme.</p>
          </li>
        </ul>
      </div>
    </section>
```

- [ ] **Step 2: Append card styles**

```css
/* === Highlights cards ======================================== */
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 20px;
}
.card h3 { margin-bottom: 8px; }
.card p { margin: 0; color: var(--muted); font-size: 15px; }

@media (max-width: 720px) {
  .cards { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:8080/ | grep -c '<li class="card">'
```
Expected: `4`.

Browser: a 2×2 grid of four cards under a "Selected highlights" heading; collapses to one column below 720px.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Selected highlights section"
```

---

### Task 7: Experience section

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Append after the Highlights section**

```html
    <section id="experience" aria-labelledby="experience-title">
      <div class="container">
        <h2 id="experience-title">Experience</h2>

        <article class="role">
          <header>
            <h3>doctorly — DevOps Team Lead</h3>
            <p class="role-meta">Mar 2022 – Present · Berlin, Germany</p>
          </header>
          <p class="role-label">Responsibilities</p>
          <ul class="role-list">
            <li>Lead a DevOps team — daily standups, retrospectives, and 1:1s.</li>
            <li>Spearhead recruitment to keep the team staffed with strong engineers.</li>
            <li>Oversee infrastructure and codebase health, enforcing repository best practices.</li>
          </ul>
          <p class="role-label">Achievements</p>
          <ul class="role-list">
            <li>Implemented and optimised Kubernetes, Terraform, Ansible, AWS, Docker, and GitLab CI/CD.</li>
            <li>Provided hands-on troubleshooting for Kubernetes clusters, Docker containers, and cloud resources.</li>
            <li>Built and maintained vendor relationships, including contract negotiation.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>serVme — Lead DevOps Engineer</h3>
            <p class="role-meta">Dec 2020 – Mar 2022 · Beirut, Lebanon</p>
          </header>
          <p class="role-label">Responsibilities</p>
          <ul class="role-list">
            <li>Transitioned a traditional architecture to fully automated CI/CD with EKS, Jenkins, and GitOps.</li>
            <li>Designed resilient, scalable cloud infrastructure on AWS with horizontal and vertical autoscaling.</li>
            <li>Reduced deployment time and AWS costs by optimising infrastructure and consolidating databases.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>CMA CGM — Digital Tech Lead</h3>
            <p class="role-meta">Feb 2020 – Nov 2020 · Beirut, Lebanon</p>
          </header>
          <p class="role-label">Responsibilities</p>
          <ul class="role-list">
            <li>Led a team focused on software development, releases, and engineering delivery.</li>
            <li>Introduced Agile methodologies (Scrum and Kanban) and GitOps best practices.</li>
            <li>Hands-on with Docker and Kubernetes; defined the SDLC for smoother development workflows.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>Inimoney Fintech — Head of Quality Assurance</h3>
            <p class="role-meta">Dec 2018 – Jan 2020 · Beirut, Lebanon</p>
          </header>
          <p class="role-label">Responsibilities</p>
          <ul class="role-list">
            <li>Collaborated with DevOps to optimise the CI/CD pipeline using automation tools.</li>
            <li>Led and mentored the QA team, automating testing with Protractor and Newman.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>Keeward Group — DevOps System Engineer</h3>
            <p class="role-meta">Jun 2012 – Jun 2018 · Beirut, Lebanon</p>
          </header>
          <p class="role-label">Achievements</p>
          <ul class="role-list">
            <li>Managed Linux servers and cloud infrastructure; designed a CI/CD pipeline for deployments.</li>
            <li>Deployed and managed Docker containers, plus Redis and Varnish caching.</li>
            <li>Migrated services to a hybrid cloud architecture across AWS, OVH, and Heroku.</li>
          </ul>
        </article>
      </div>
    </section>
```

- [ ] **Step 2: Append role styles**

```css
/* === Experience ============================================== */
.role { padding: 24px 0; border-bottom: 1px solid var(--hairline); }
.role:last-of-type { border-bottom: 0; padding-bottom: 0; }
.role:first-of-type { padding-top: 0; }
.role header { margin-bottom: 14px; }
.role h3 { margin-bottom: 4px; }
.role-meta { margin: 0; color: var(--muted); font-size: 14px; }
.role-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
  font-weight: 600;
  margin: 14px 0 8px;
}
.role-list { padding-left: 20px; list-style: disc; color: var(--text); }
.role-list li { margin-bottom: 6px; font-size: 16px; }
.role-list li::marker { color: var(--muted); }
```

- [ ] **Step 3: Verify all five roles are present**

```bash
curl -s http://localhost:8080/ | grep -c '<article class="role">'
```
Expected: `5`.

```bash
curl -s http://localhost:8080/ | grep -E "doctorly|serVme|CMA CGM|Inimoney|Keeward" | wc -l | tr -d ' '
```
Expected: `5`.

Browser: roles are listed top-to-bottom, most recent first, each with title, dates, and bullets.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Experience section with all five roles"
```

---

### Task 8: Skills section

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Append after the Experience section**

```html
    <section id="skills" aria-labelledby="skills-title">
      <div class="container">
        <h2 id="skills-title">Skills</h2>
        <div class="skills">
          <div class="skill-group">
            <p class="skill-label">Cloud</p>
            <p>AWS</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Orchestration</p>
            <p>Kubernetes, Docker</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Infrastructure as code</p>
            <p>Terraform, Ansible</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">CI/CD &amp; GitOps</p>
            <p>GitLab CI/CD, Jenkins, GitOps</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Systems</p>
            <p>Linux administration, Git</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Leadership</p>
            <p>Team management, Agile (Scrum/Kanban), Hiring, Mentoring</p>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append skill styles**

```css
/* === Skills ================================================== */
.skills {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 32px;
}
.skill-group p { margin: 0; }
.skill-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 4px !important;
}

@media (max-width: 560px) {
  .skills { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:8080/ | grep -c '<div class="skill-group">'
```
Expected: `6`.

Browser: 2-column skills grid on desktop, single column under 560px.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Skills section"
```

---

### Task 9: Education, Certifications, Languages

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Append after Skills**

```html
    <section id="education" aria-labelledby="education-title">
      <div class="container">
        <h2 id="education-title">Education &amp; Certifications</h2>

        <div class="edu-grid">
          <div>
            <p class="skill-label">Education</p>
            <ul class="plain-list">
              <li><strong>Conservatoire National des Arts et Métiers</strong> — Analysis and Conception of System Information and Decisions, Computer Science · 2008 – 2009</li>
              <li><strong>IB Formation, France</strong> — VMware vSphere 4.1 · 2011</li>
              <li><strong>DIAFOR, France</strong> — System and Network Administration · 2007 – 2008</li>
              <li><strong>Université de Rennes I</strong> — DEUG, Science · 2003 – 2005</li>
            </ul>
          </div>

          <div>
            <p class="skill-label">Certifications</p>
            <ul class="pill-list" aria-label="Certifications">
              <li>Linux Foundation Certified System Administrator (LFCS)</li>
              <li>AWS Certified Solutions Architect – Associate</li>
              <li>Certified Kubernetes Administrator (CKA)</li>
            </ul>

            <p class="skill-label" style="margin-top:24px">Languages</p>
            <p><strong>Arabic</strong> (native) · <strong>French</strong> (native) · <strong>English</strong> (professional)</p>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append styles**

```css
/* === Education & certs ======================================= */
.edu-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
}
.plain-list li { margin-bottom: 12px; font-size: 15px; }
.pill-list { display: flex; flex-wrap: wrap; gap: 8px; }
.pill-list li {
  font-size: 13px;
  color: var(--text);
  border: 1px solid var(--hairline);
  background: var(--surface);
  border-radius: 999px;
  padding: 5px 12px;
}

@media (max-width: 720px) {
  .edu-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:8080/ | grep -c '<li>Linux Foundation Certified System Administrator (LFCS)</li>'
```
Expected: `1`.

```bash
curl -s http://localhost:8080/ | grep -F "Arabic"
```
Expected: one matching line.

Browser: two-column layout on desktop (Education on the left, Certifications + Languages on the right), single column under 720px.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Education, Certifications, and Languages"
```

---

### Task 10: Contact section + Footer

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Append after Education (still inside `<main>`)**

```html
    <section id="contact" aria-labelledby="contact-title">
      <div class="container">
        <h2 id="contact-title">Get in touch</h2>
        <p>Open to senior DevOps and platform leadership conversations.</p>
        <div class="hero-cta" style="margin-top:24px">
          <a class="btn btn-primary"
             href="https://calendar.proton.me/bookings#Dv2Q_7jlUkUFkPm_nYaAfuSyQcXUWxr8x0z3WEYh89g="
             target="_blank" rel="noopener noreferrer">Book a meeting</a>
          <a class="btn btn-secondary"
             href="https://www.linkedin.com/in/alainch"
             target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a class="btn btn-secondary"
             href="https://github.com/sys0dm1n"
             target="_blank" rel="noopener noreferrer">GitHub @sys0dm1n</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Close `</main>` (after the Contact section) and add the footer before `</body>`**

After the Contact section's `</section>`, close `</main>` and immediately add:

```html
  <footer class="site-footer">
    <div class="container footer-row">
      <p>&copy; 2026 Alain C.</p>
      <p>
        <a href="https://www.linkedin.com/in/alainch" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        ·
        <a href="https://github.com/sys0dm1n" target="_blank" rel="noopener noreferrer">GitHub</a>
      </p>
    </div>
  </footer>
```

- [ ] **Step 3: Append footer styles**

```css
/* === Footer ================================================== */
.site-footer {
  border-top: 1px solid var(--hairline);
  padding: 32px 0;
  color: var(--muted);
  font-size: 14px;
}
.footer-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.site-footer p { margin: 0; }
.site-footer a { color: var(--muted); }
.site-footer a:hover { color: var(--text); }
```

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:8080/ | grep -c "calendar.proton.me/bookings"
```
Expected: `3` (nav + hero + contact).

```bash
curl -s http://localhost:8080/ | grep -F "© 2026 Alain C."
```
Expected: one matching line (HTML entity `&copy;` is decoded by curl/grep? It will not be. Adjust to grep the entity):

```bash
curl -s http://localhost:8080/ | grep -F "&copy; 2026 Alain C."
```
Expected: one matching line.

Browser: Contact section ends the main column with three buttons; footer below shows copyright on the left and LinkedIn/GitHub on the right.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Contact section and footer"
```

---

### Task 11: Mobile menu toggle (JS)

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Write the menu-toggle module** (overwrite `js/main.js`)

```js
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
```

- [ ] **Step 2: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/js/main.js
```
Expected: `200`.

Browser at width <720px:
1. Tap the hamburger — menu slides open.
2. Tap a link — menu closes.
3. Open menu, press `Escape` — menu closes.
4. Open the DevTools console: no errors.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Add mobile menu toggle"
```

---

### Task 12: Scroll-spy active nav link + reveal-on-scroll

**Files:**
- Modify: `js/main.js`, `css/style.css`

- [ ] **Step 1: Append to `js/main.js`**

```js
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
```

- [ ] **Step 2: Append reveal styles to `css/style.css`**

```css
/* === Reveal-on-scroll ======================================== */
.reveal {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 240ms ease, transform 240ms ease;
}
.reveal.is-revealed {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 3: Verify**

Browser at desktop width:
1. Scroll the page — the active nav link should update to whichever section is in view (`aria-current="true"` toggles its color).
2. Sections fade-and-lift in as you scroll.
3. Open OS-level "Reduce motion" (System Settings → Accessibility → Display on macOS), reload — no fade/lift animations play; everything is visible immediately.

Quick scriptable sanity check that the JS parses:

```bash
node -c js/main.js && echo OK
```
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add js/main.js css/style.css
git commit -m "Add scroll-spy and reveal-on-scroll, motion-preference safe"
```

---

### Task 13: Skip-to-content link + a11y polish

**Files:**
- Modify: `index.html`, `css/style.css`

- [ ] **Step 1: Add the skip link as the first child of `<body>`** — insert immediately after `<body id="top">`

```html
  <a class="skip-link" href="#main-content">Skip to content</a>
```

- [ ] **Step 2: Add `id="main-content"` to the `<main>` opening tag**

Change `<main>` to `<main id="main-content">`.

- [ ] **Step 3: Append skip-link styles**

```css
/* === Skip link =============================================== */
.skip-link {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--text);
  color: var(--bg);
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transform: translateY(-150%);
  transition: transform 120ms ease;
  z-index: 100;
}
.skip-link:focus { transform: translateY(0); text-decoration: none; }
```

- [ ] **Step 4: Verify with the keyboard**

In the browser, click the address bar, then press `Tab`. The first focusable element should be the "Skip to content" link, appearing in the top-left. Pressing `Enter` jumps focus to the start of `<main>`.

```bash
curl -s http://localhost:8080/ | grep -F 'class="skip-link"'
```
Expected: one matching line.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css
git commit -m "Add skip-to-content link"
```

---

### Task 14: SEO meta + OpenGraph + favicon SVG

**Files:**
- Modify: `index.html`
- Create: `favicon.svg`

- [ ] **Step 1: Create `favicon.svg`** (AC monogram on white, accent-stamped)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="AC">
  <rect width="64" height="64" rx="12" fill="#0f172a"/>
  <text x="32" y="42"
        font-family="-apple-system, Segoe UI, Roboto, system-ui, sans-serif"
        font-size="28" font-weight="700"
        text-anchor="middle" fill="#ffffff">AC</text>
</svg>
```

- [ ] **Step 2: Add favicon + SEO/OG/Twitter meta to `index.html` `<head>`**

Insert this block immediately **after** the existing `<meta name="description" ...>` line:

```html
  <link rel="icon" type="image/svg+xml" href="favicon.svg">

  <!-- Canonical -->
  <link rel="canonical" href="https://sys0dm1n.github.io/">

  <!-- OpenGraph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://sys0dm1n.github.io/">
  <meta property="og:title" content="Alain C. — DevOps Team Lead">
  <meta property="og:description" content="DevOps Team Lead with 10+ years building reliable cloud platforms and the teams behind them.">
  <meta property="og:image" content="https://sys0dm1n.github.io/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Alain C. — DevOps Team Lead">
  <meta name="twitter:description" content="DevOps Team Lead with 10+ years building reliable cloud platforms and the teams behind them.">
  <meta name="twitter:image" content="https://sys0dm1n.github.io/og-image.png">
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:8080/ | grep -F 'property="og:title"'
```
Expected: one matching line.

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/favicon.svg
```
Expected: `200`.

In the browser tab: the AC monogram should now appear as the favicon.

- [ ] **Step 4: Commit**

```bash
git add index.html favicon.svg
git commit -m "Add favicon, SEO meta, OpenGraph, Twitter card"
```

---

### Task 15: OG image (1200×630 PNG)

**Files:**
- Create: `og-image.html` (intermediate, deleted after rendering), `og-image.png`

This task generates a real PNG that LinkedIn and Slack will use as the link preview. We render an HTML mock at 1200×630 via headless Chrome.

- [ ] **Step 1: Locate a headless Chrome binary**

```bash
ls -1 \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  2>/dev/null | head -1
```
Expected: at least one path printed. **If nothing prints**, skip to Step 7 (alternative path).

Export it for the subsequent steps (use the path printed above):

```bash
export CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

- [ ] **Step 2: Create `og-image.html`** — a self-contained 1200×630 card

```html
<!doctype html>
<html><head><meta charset="utf-8"><style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body {
    width: 1200px; height: 630px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif;
    color: #0f172a;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 96px; box-sizing: border-box;
  }
  .eyebrow { font-size: 18px; letter-spacing: .22em; text-transform: uppercase; color: #475569; font-weight: 600; }
  h1 { font-size: 96px; font-weight: 700; letter-spacing: -0.02em; margin: 18px 0 12px; }
  .sub { font-size: 32px; color: #0f172a; max-width: 920px; margin: 0; }
  .meta { font-size: 22px; color: #475569; margin-top: 28px; }
  .rule { height: 4px; width: 88px; background: #1d4ed8; margin-top: 36px; border-radius: 2px; }
</style></head>
<body>
  <p class="eyebrow">DevOps Team Lead</p>
  <h1>Alain C.</h1>
  <p class="sub">Building reliable cloud platforms and the teams behind them.</p>
  <p class="meta">Beirut · Berlin · 10+ years · AWS · Kubernetes · Terraform</p>
  <div class="rule"></div>
</body></html>
```

- [ ] **Step 3: Render `og-image.png`**

```bash
"$CHROME" \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --window-size=1200,630 \
  --default-background-color=00000000 \
  --screenshot="$PWD/og-image.png" \
  "file://$PWD/og-image.html"
```

- [ ] **Step 4: Verify dimensions**

```bash
file og-image.png
```
Expected output contains: `PNG image data, 1200 x 630`.

- [ ] **Step 5: Delete the intermediate HTML**

```bash
rm og-image.html
```

- [ ] **Step 6: Verify the live page serves it**

```bash
curl -sI http://localhost:8080/og-image.png | head -1
```
Expected: `HTTP/1.0 200 OK`.

- [ ] **Step 7 (only if Step 1 found no Chrome binary): manual fallback**

Open `og-image.html` in any browser, take a screenshot constrained to 1200×630, save as `og-image.png` in the repo root, then continue to Step 8. If no path produces a working PNG, remove the four `og:image*` and `twitter:image` lines added in Task 14 — the rest of the site still works.

- [ ] **Step 8: Commit**

```bash
git add og-image.png
git commit -m "Add 1200x630 OG image for social previews"
```

---

### Task 16: 404 page

**Files:**
- Create: `404.html`

- [ ] **Step 1: Write `404.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — Alain C.</title>
  <meta name="description" content="Page not found.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="css/style.css">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XH22477GS5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XH22477GS5');
  </script>
</head>
<body>
  <main id="main-content" style="min-height:70vh; display:flex; align-items:center;">
    <div class="container" style="text-align:center; padding-top: var(--pad-section); padding-bottom: var(--pad-section);">
      <p class="eyebrow">404</p>
      <h1 style="margin: 12px 0 16px;">Page not found</h1>
      <p class="muted" style="margin: 0 0 28px;">The page you’re looking for isn’t here.</p>
      <a class="btn btn-primary" href="/">Back to home</a>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/404.html
```
Expected: `200`.

Browser at `http://localhost:8080/404.html`: shows "404 / Page not found / Back to home" in the same visual style.

- [ ] **Step 3: Commit**

```bash
git add 404.html
git commit -m "Add 404 page"
```

---

### Task 17: Final manual verification + Lighthouse

**Files:**
- (no edits unless issues are found)

- [ ] **Step 1: Walk through the spec's verification checklist**

For each box below, perform the check at `http://localhost:8080/` and check it off only when it passes. If any fails, **fix the underlying file and commit a small follow-up**, then re-run the failing check.

- [ ] Site opens at `index.html`; all sections render in order: nav · hero · about · highlights · experience · skills · education · contact · footer.
- [ ] All anchor nav links scroll to their sections (`#about`, `#experience`, `#education`, `#contact`).
- [ ] `Book a meeting` button opens the Proton URL in a new tab. Verify:
  ```bash
  curl -s http://localhost:8080/ | grep -F "calendar.proton.me/bookings#Dv2Q_7jlUkUFkPm_nYaAfuSyQcXUWxr8x0z3WEYh89g=" | wc -l | tr -d ' '
  ```
  Expected: `3`.
- [ ] LinkedIn and GitHub links open in new tabs without errors.
- [ ] Mobile width 375px (DevTools device toolbar): nav collapses, hamburger opens the menu, no horizontal scroll, content readable.
- [ ] Keyboard navigation: from a fresh page load, `Tab` reveals the skip link first; `Enter` jumps to main; subsequent tabs cycle through all interactive elements with a visible focus ring.
- [ ] DevTools Console: no errors, no warnings (other than third-party GA notices).
- [ ] DevTools Network: a request to `googletagmanager.com` or `google-analytics.com` is made on load.
- [ ] View source (Ctrl/Cmd-U): no email address appears in the HTML.
  ```bash
  curl -s http://localhost:8080/ | grep -iE "mailto:|chemalyalain" | wc -l | tr -d ' '
  ```
  Expected: `0`.
- [ ] OG image present and correct size:
  ```bash
  file og-image.png
  ```
  Expected: `PNG image data, 1200 x 630`.

- [ ] **Step 2: Run Lighthouse**

In Chrome DevTools → Lighthouse → "Navigation (Default)" → Mobile and Desktop. Run both.

- [ ] Accessibility ≥ 95 (mobile and desktop).
- [ ] SEO ≥ 95.
- [ ] Best Practices ≥ 95.
- [ ] Performance ≥ 90 (acceptable lower target due to GA blocking-ish script).

If Accessibility drops below 95, the most likely causes are contrast, missing labels, or non-semantic landmarks — fix and recommit.

- [ ] **Step 3: Final commit (only if Step 1 or 2 required fixes)**

```bash
git status      # confirm any fixups are committed
git log --oneline -25
```

- [ ] **Step 4: Open a PR for review**

```bash
git push -u origin redesign/executive-light
gh pr create --base master --head redesign/executive-light \
  --title "Redesign: Executive Light personal landing site" \
  --body "Implements docs/superpowers/specs/2026-05-21-personal-site-redesign-design.md"
```

Verify the PR diff matches expectations: `_config.yml` and `index.md` deleted; new `index.html`, `css/style.css`, `js/main.js`, `.nojekyll`, `404.html`, `favicon.svg`, `og-image.png` added.

---

## Self-review (post-write)

- **Spec coverage:** every section in the spec maps to a task — sticky nav (3), hero (4), about+stats (5), highlights (6), experience (7), skills (8), education+certs+languages (9), contact+footer (10); booking button bot-safe wiring (3/4/10); design tokens (2); a11y/SEO/ops (13/14/17); favicon (14); OG image (15); 404 (16); manual verification (17). Jekyll removal handled in (1).
- **Placeholder scan:** no "TBD", "TODO", or vague directives. Every code step contains the actual code or command.
- **Type/name consistency:** CSS class names used in HTML (`brand`, `nav`, `nav-toggle`, `nav-menu`, `data-menu`, `chips`, `hero-cta`, `card`, `cards`, `role`, `role-list`, `role-label`, `skill-group`, `skill-label`, `plain-list`, `pill-list`, `edu-grid`, `site-footer`, `footer-row`, `skip-link`, `reveal`, `is-revealed`) match their CSS rules. The data-attribute selector `[data-menu]` used by the JS in Task 11 is set on the `<ul>` in Task 3. The `BOOKING_URL` value is identical in all three places (nav, hero, contact). GA tag `G-XH22477GS5` appears in both `index.html` (Task 1) and `404.html` (Task 16).

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-21-personal-site-redesign.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session, batch execution with checkpoints.

Which approach?
