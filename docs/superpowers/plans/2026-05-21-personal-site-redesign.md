# Personal Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Jekyll/hacker-theme CV at sys0dm1n.github.io with a single-page Executive Light personal landing site that folds in the user's LinkedIn content, including a bot-safe "Book a meeting" CTA wired to a Proton Calendar URL.

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
  <meta name="description" content="DevOps Team Lead with 15+ years building reliable cloud platforms and remote teams. Specialised in Remote DevOps & B2B.">
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
        <p class="hero-sub">Remote-first DevOps leadership. Building reliable cloud platforms — and the teams behind them.</p>
        <p class="hero-meta">Beirut · Berlin · 15+ years</p>

        <ul class="chips" aria-label="Core technologies">
          <li>AWS</li><li>Azure</li><li>Kubernetes</li><li>Terraform</li>
          <li>Ansible</li><li>ArgoCD</li><li>Docker</li><li>Linux</li>
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
curl -s http://localhost:8080/ | grep -F "Remote-first DevOps leadership. Building reliable cloud platforms — and the teams behind them."
```
Expected: one matching line.

```bash
curl -s http://localhost:8080/ | grep -c '<li>Azure</li>'
```
Expected: `1`.

In the browser: hero shows eyebrow, large name, positioning sentence, location/years meta line ("Beirut · Berlin · 15+ years"), 8 chips, and two CTAs (blue primary + outline secondary). The "Book a meeting" anchor opens in a new tab.

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
          DevOps Team Lead with 15+ years building and leading high-performing remote teams across Europe and the Middle East. I turn infrastructure into a competitive advantage — automating CI/CD pipelines, scaling cloud environments on AWS and Azure, and enabling dev teams to ship faster with confidence. Remote-first by design: I lead fully distributed teams across time zones on a foundation of trust, async communication, and strong engineering culture. Open to DevOps Lead, Head of DevOps, and DevOps Architect roles — remote or hybrid, B2B or employee.
        </p>

        <dl class="stats" aria-label="At a glance">
          <div><dt>15+</dt><dd>years</dd></div>
          <div><dt>40%</dt><dd>AWS savings</dd></div>
          <div><dt>50%</dt><dd>less downtime</dd></div>
          <div><dt>3</dt><dd>languages</dd></div>
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

```bash
curl -s http://localhost:8080/ | grep -F "15+ years building and leading high-performing remote teams"
```
Expected: one matching line.

Browser: About section appears below the hero with a subdivider hairline, summary paragraph emphasising 15+ years and remote leadership, and a 4-up stats strip (15+ / 40% / 50% / 3) that wraps to 2×2 below 560px.

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
            <h3>Cut deployment cycles 1 month → 2 days</h3>
            <p>Replaced slow, manual release processes with automated CI/CD and GitOps so engineering teams could ship multiple times a week instead of once a month.</p>
          </li>
          <li class="card">
            <h3>40% AWS cost reduction</h3>
            <p>Cut recurring cloud spend by ~40% through infrastructure optimisation: right-sized compute, consolidated databases, and pruned unused services.</p>
          </li>
          <li class="card">
            <h3>50% less downtime · 80% better availability</h3>
            <p>Improved customer-facing reliability with resilient architecture, autoscaling, and proactive operations across production environments.</p>
          </li>
          <li class="card">
            <h3>Built &amp; led remote DevOps teams</h3>
            <p>Grew distributed teams from the ground up across Europe and the Middle East — hiring, structured 1:1s, retros, and mentoring focused on engineer ownership.</p>
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

```bash
curl -s http://localhost:8080/ | grep -F "Cut deployment cycles 1 month"
```
Expected: one matching line.

Browser: a 2×2 grid of four impact cards under a "Selected highlights" heading; collapses to one column below 720px.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Selected highlights with quantified impact cards"
```

---

### Task 7: Experience section

**Files:**
- Modify: `index.html`, `css/style.css`

This section lists **7 detailed roles** in reverse-chronological order, followed by an **"Earlier roles"** sub-heading with 6 condensed one-line entries.

- [ ] **Step 1: Append after the Highlights section**

```html
    <section id="experience" aria-labelledby="experience-title">
      <div class="container">
        <h2 id="experience-title">Experience</h2>

        <article class="role">
          <header>
            <h3>doctorly — DevOps Team Lead</h3>
            <p class="role-meta">Feb 2026 – Present · Berlin, Germany</p>
          </header>
          <p>Returning to doctorly to continue evolving the platform built during the 2022–2025 stint below: Kubernetes on AWS, multi-environment Terraform, GitLab CI/CD with security scanning, and ArgoCD-driven deployments.</p>
        </article>

        <article class="role">
          <header>
            <h3>CompuGroup Medical SE &amp; Co. KGaA — DevOps Tech Lead</h3>
            <p class="role-meta">May 2025 – Jan 2026 · Germany</p>
          </header>
          <p class="role-label">Highlights</p>
          <ul class="role-list">
            <li>Built the Azure cloud infrastructure entirely from scratch.</li>
            <li>Designed a Terraform umbrella-module architecture for scalable, consistent multi-tenant and multi-environment provisioning.</li>
            <li>Introduced ArgoCD for a true GitOps workflow: dev environments auto-update on every commit; production releases trigger only on Helm chart version or values-file changes.</li>
            <li>Deployed and managed AKS with zone-aware node pools; integrated APISIX as the API Gateway with automated tenant onboarding.</li>
            <li>Documented DNS changes, migration checklists, and operational runbooks to ensure team continuity.</li>
            <li>Contributed to the company's C5 (BSI Cloud Computing Compliance Criteria Catalogue) compliance effort — infrastructure design, access controls, and operational processes.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>doctorly — DevOps Team Lead</h3>
            <p class="role-meta">Mar 2022 – Apr 2025 · Berlin, Germany</p>
          </header>
          <p>DevOps Lead &amp; Infrastructure Architect — led the design and delivery of doctorly's complete infrastructure and CI/CD ecosystem from the ground up, while driving the multi-tenancy initiative.</p>

          <p class="role-label">Team leadership</p>
          <ul class="role-list">
            <li>Built and managed a 3–5 person team through structured standups, 1:1s, and retrospectives.</li>
            <li>Spearheaded hiring and professional development to scale the team's technical capabilities.</li>
          </ul>

          <p class="role-label">Infrastructure</p>
          <ul class="role-list">
            <li>Owned the entire stack — AWS, Kubernetes, Terraform, Ansible — across 5 production environments.</li>
            <li>Maintained infrastructure-as-code repos with rigorous standards.</li>
            <li>Proactively managed technical modernisation (ingress → API Gateway migrations, Terraform module upgrades).</li>
          </ul>

          <p class="role-label">CI/CD &amp; security</p>
          <ul class="role-list">
            <li>Architected multi-stage GitLab CI/CD pipelines with SAST, dependency, secret, and container scanning.</li>
            <li>Built custom CLI tooling to streamline day-to-day operations.</li>
            <li>Deployed ArgoCD for GitOps-driven deployments.</li>
          </ul>

          <p class="role-label">Technical decision-making</p>
          <ul class="role-list">
            <li>Lead on Kubernetes, Terraform, Ansible, AWS, Docker, Linux, and Nginx.</li>
            <li>Mentored the team on troubleshooting and incident response while balancing modernisation with stability.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>serVme — Lead DevOps Engineer</h3>
            <p class="role-meta">Dec 2020 – Mar 2022 · Beirut, Lebanon</p>
          </header>
          <ul class="role-list">
            <li>Migrated from a classic architecture to a fully automated CI/CD pipeline using EKS, Jenkins, and GitOps.</li>
            <li>Designed a resilient architecture with horizontal and vertical autoscaling.</li>
            <li>Managed, improved, and monitored cloud infrastructure on AWS using Terraform and CloudWatch.</li>
            <li>Built and deployed Docker containers to break up a monolith into microservices, improving developer workflow, scalability, and speed.</li>
            <li>Managed GitHub/Bitbucket repositories and permissions, including branching.</li>
            <li>Reduced deployment time and AWS costs by eliminating unnecessary servers and consolidating databases.</li>
            <li>Wrote Ansible playbooks to configure and manage servers.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>CMA CGM — Digital Tech Lead</h3>
            <p class="role-meta">Feb 2020 – Nov 2020 · Beirut, Lebanon</p>
          </header>
          <ul class="role-list">
            <li>Led a team focused on software development, releases, and engineering delivery.</li>
            <li>Hired and trained staff, delegated work, and partnered with colleagues on DevOps obstacles.</li>
            <li>Introduced Agile methodologies (Scrum and Kanban) and GitOps best practices.</li>
            <li>Hands-on with Docker and Kubernetes; defined the SDLC for smoother development workflows.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>Inimoney Fintech — Head of Quality Assurance / DevOps Team Lead</h3>
            <p class="role-meta">Jul 2018 – Jan 2020 · Beirut, Lebanon</p>
          </header>
          <p class="role-label">As Head of QA (Dec 2018 – Jan 2020)</p>
          <ul class="role-list">
            <li>Worked closely with DevOps and the testing team to define the optimal solution.</li>
            <li>Owned QA operational requirements — scheduling, assignment, and follow-up on work results.</li>
            <li>Built and maintained QA staff (DevOps and Test departments) via recruiting, orienting, and training.</li>
            <li>Automated testing with Protractor and Newman for the CI/CD pipeline.</li>
          </ul>
          <p class="role-label">As DevOps Team Lead (Jul 2018 – Jan 2020)</p>
          <ul class="role-list">
            <li>Team management and mentoring — weekly standups, task assignment, and follow-up (Kanban in Jira).</li>
            <li>Recruitment and team growth.</li>
            <li>Created and maintained a fully automated CI/CD pipeline using Jenkins, Docker, Git, and Helm.</li>
            <li>Managed cloud infrastructure on AWS (EC2, S3, RDS) — backups, patches, scaling.</li>
            <li>Integrated security and compliance into the CI/CD pipeline; performed security scans.</li>
            <li>Deployed Kubernetes clusters on AWS using Kubespray; monitored with Prometheus and Grafana.</li>
            <li>Wrote Ansible playbooks (IaC) and managed GitHub repos, branching, webhooks, and GitOps best practices.</li>
            <li>Kept documentation up to date in Confluence.</li>
          </ul>
        </article>

        <article class="role">
          <header>
            <h3>Keeward Group — DevOps System Engineer / IT Manager</h3>
            <p class="role-meta">Jun 2012 – Jun 2018 · Beirut, Lebanon</p>
          </header>
          <p class="role-label">DevOps System Engineer</p>
          <ul class="role-list">
            <li>Installed, configured, administered, and troubleshot Linux servers (Ansible-driven) running Apache/Nginx, Varnish/HAProxy, and Redis.</li>
            <li>Designed, implemented, and maintained a dynamic infrastructure to support software development, test, and deployment (CI/CD).</li>
            <li>Deployed caching solutions (Varnish, Redis, Nginx) and a Postfix/Dovecot mail server.</li>
            <li>Monitored servers and network equipment using PingDom, NewRelic, DataDogHQ, Monit, Observium, and Nagios.</li>
            <li>Built architectures on Debian/Ubuntu with virtualisation; configured Cisco network equipment (WAP4410N, C3560X, ASA 5505).</li>
            <li>Ran a hybrid-cloud architecture across AWS, OVH, and Heroku.</li>
            <li>Worked Agile/Scrum with Jira and Confluence; tooling: Ansible, GitLab, GitLab CI, Docker, Docker Compose.</li>
          </ul>
          <p class="role-label">IT Manager (parallel role)</p>
          <ul class="role-list">
            <li>Managed information technology and computer systems; planned, organised, and evaluated IT data operations.</li>
            <li>Recruited, trained, and coached IT staff; communicated expectations and appraised performance.</li>
            <li>Designed and coordinated IT systems, policies, and procedures; managed accounts and access lifecycle.</li>
            <li>Ensured data security, network access, and backup integrity.</li>
            <li>Handled annual budget and procurement, ensuring cost-effectiveness.</li>
          </ul>
        </article>

        <h3 class="earlier-heading">Earlier roles</h3>
        <ul class="earlier-list">
          <li><strong>ARUMTEC</strong> — Linux System Engineer (for ESMA) · Jan 2012 – May 2012 · Paris, France</li>
          <li><strong>Sollan</strong> — IT Manager · May 2010 – Dec 2011</li>
          <li><strong>North Caspian Operating Company</strong> — Service Desk Administrator · Nov 2009 – May 2010</li>
          <li><strong>Xnet Conseils</strong> — IT Manager · Sep 2008 – Sep 2009</li>
          <li><strong>Orange Business Services</strong> — Network Support Technician · Jul 2008 – Aug 2008</li>
          <li><strong>Lycée Sainte Thérèse</strong> — System and Network Administrator · Jan 2008 – Apr 2008</li>
        </ul>
      </div>
    </section>
```

- [ ] **Step 2: Append role styles to `css/style.css`**

```css
/* === Experience ============================================== */
.role { padding: 24px 0; border-bottom: 1px solid var(--hairline); }
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

.earlier-heading {
  margin-top: 32px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
  font-weight: 600;
}
.earlier-list {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}
.earlier-list li { color: var(--text); font-size: 15px; }
.earlier-list strong { font-weight: 600; }
```

- [ ] **Step 3: Verify role counts**

```bash
curl -s http://localhost:8080/ | grep -c '<article class="role">'
```
Expected: `7`.

```bash
curl -s http://localhost:8080/ | grep -F "Earlier roles"
```
Expected: one matching line.

```bash
curl -s http://localhost:8080/ | sed -n '/earlier-list/,/<\/ul>/p' | grep -c '<li>'
```
Expected: `6`.

Browser: 7 detailed role articles in reverse-chronological order, then an "Earlier roles" sub-heading with 6 single-line entries.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Experience section: 7 detailed roles + 6 earlier roles"
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
            <p>AWS, Azure</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Orchestration &amp; GitOps</p>
            <p>Kubernetes (EKS, AKS), Docker, Helm, ArgoCD</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Infrastructure as code</p>
            <p>Terraform (umbrella modules), Ansible</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">CI/CD &amp; Security</p>
            <p>GitLab CI/CD, GitHub Actions, Jenkins, SAST / dependency / secret / container scanning, C5 (BSI) compliance</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Observability</p>
            <p>Prometheus, Grafana, CloudWatch</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Systems</p>
            <p>Linux administration, Git, Nginx, APISIX</p>
          </div>
          <div class="skill-group">
            <p class="skill-label">Leadership</p>
            <p>Remote team management, Agile (Scrum/Kanban), Hiring, Mentoring, B2B engagements</p>
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
Expected: `7`.

```bash
curl -s http://localhost:8080/ | grep -F "Azure"
```
Expected: at least one matching line (Azure appears in the hero chips and in Skills/Cloud).

Browser: 2-column skills grid on desktop, single column under 560px.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Skills section"
```

---

### Task 9: Education + Languages (no Certifications section)

**Files:**
- Modify: `index.html`, `css/style.css`

The Certifications heading and certifications block are intentionally omitted per the spec.

- [ ] **Step 1: Append after Skills**

```html
    <section id="education" aria-labelledby="education-title">
      <div class="container">
        <h2 id="education-title">Education</h2>

        <ul class="plain-list">
          <li><strong>Conservatoire National des Arts et Métiers</strong> — Analysis and Conception of System Information and Decisions, Computer Science · 2008 – 2009</li>
          <li><strong>IB Formation, France</strong> — VMware vSphere 4.1 · 2011</li>
          <li><strong>DIAFOR, France</strong> — System and Network Administration · 2007 – 2008</li>
          <li><strong>Université de Rennes I</strong> — DEUG, Science · 2003 – 2005</li>
          <li><strong>Collège De la Sagesse</strong> — High School Diploma, Mathematics · 1984 – 2001</li>
        </ul>

        <p class="skill-label" style="margin-top:28px">Languages</p>
        <p><strong>Lebanese</strong> (native) · <strong>French</strong> (native) · <strong>English</strong> (professional working)</p>
      </div>
    </section>
```

- [ ] **Step 2: Append styles**

```css
/* === Education =============================================== */
.plain-list li { margin-bottom: 12px; font-size: 15px; }
```

- [ ] **Step 3: Verify there is no Certifications heading anywhere**

```bash
curl -si http://localhost:8080/ | grep -ci "certification"
```
Expected: `0`.

```bash
curl -s http://localhost:8080/ | grep -F "Collège De la Sagesse"
```
Expected: one matching line.

```bash
curl -s http://localhost:8080/ | grep -F "Lebanese"
```
Expected: one matching line.

Browser: single-column Education list with five entries (CNAM, IB Formation, DIAFOR, Université de Rennes I, Collège De la Sagesse), followed by an inline "Languages" line — no Certifications heading anywhere.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Education and Languages (no certifications block per spec)"
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
        <p>Open to DevOps Lead, Head of DevOps, and DevOps Architect roles — remote, hybrid, B2B or employee.</p>
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
curl -s http://localhost:8080/ | grep -F "&copy; 2026 Alain C."
```
Expected: one matching line.

```bash
curl -s http://localhost:8080/ | grep -F "DevOps Lead, Head of DevOps, and DevOps Architect"
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

- [ ] **Step 1: Create `favicon.svg`** (AC monogram on slate)

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
  <meta property="og:description" content="DevOps Team Lead with 15+ years building reliable cloud platforms and remote teams. Specialised in Remote DevOps & B2B.">
  <meta property="og:image" content="https://sys0dm1n.github.io/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Alain C. — DevOps Team Lead">
  <meta name="twitter:description" content="DevOps Team Lead with 15+ years building reliable cloud platforms and remote teams. Specialised in Remote DevOps & B2B.">
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
  .sub { font-size: 30px; color: #0f172a; max-width: 920px; margin: 0; }
  .meta { font-size: 22px; color: #475569; margin-top: 28px; }
  .rule { height: 4px; width: 88px; background: #1d4ed8; margin-top: 36px; border-radius: 2px; }
</style></head>
<body>
  <p class="eyebrow">DevOps Team Lead</p>
  <h1>Alain C.</h1>
  <p class="sub">Remote-first DevOps leadership. Building reliable cloud platforms — and the teams behind them.</p>
  <p class="meta">Beirut · Berlin · 15+ years · AWS · Azure · Kubernetes · Terraform</p>
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
- [ ] View source: no email address or phone number appears in the HTML.
  ```bash
  curl -s http://localhost:8080/ | grep -iE "mailto:|chemalyalain|tel:|009617" | wc -l | tr -d ' '
  ```
  Expected: `0`.
- [ ] Experience contains 7 detailed roles + 6 condensed earlier roles:
  ```bash
  curl -s http://localhost:8080/ | grep -c '<article class="role">'
  ```
  Expected: `7`.
- [ ] No Certifications heading or pill list appears:
  ```bash
  curl -si http://localhost:8080/ | grep -ci "certification"
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

- **Spec coverage:** every section in the updated spec maps to a task — sticky nav (3), hero with 15+ years / Azure / ArgoCD chips (4), about + concrete-impact stats (5), 4 quantified highlights (6), 7 detailed + 6 condensed roles in experience (7), 7-group skills (8), education without certifications + Lebanese languages line (9), contact + footer with the new closing line (10); booking button bot-safe wiring (3/4/10); design tokens (2); a11y/SEO/ops (13/14/17); favicon (14); OG image with updated subhead (15); 404 (16); manual verification (17). Jekyll removal handled in (1).
- **Placeholder scan:** no "TBD", "TODO", or vague directives. Every code step contains the actual code or command.
- **Type/name consistency:** CSS class names used in HTML (`brand`, `nav`, `nav-toggle`, `nav-menu`, `data-menu`, `chips`, `hero-cta`, `card`, `cards`, `role`, `role-list`, `role-label`, `earlier-heading`, `earlier-list`, `skill-group`, `skill-label`, `plain-list`, `footer-row`, `skip-link`, `reveal`, `is-revealed`) match their CSS rules. The `pill-list` class is removed everywhere along with the Certifications block. The data-attribute selector `[data-menu]` used by the JS in Task 11 is set on the `<ul>` in Task 3. The `BOOKING_URL` value is identical in all three places (nav, hero, contact). GA tag `G-XH22477GS5` appears in both `index.html` (Task 1) and `404.html` (Task 16). The verification checks in Task 17 reflect the absence of any certifications heading.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-21-personal-site-redesign.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session, batch execution with checkpoints.

Which approach?
