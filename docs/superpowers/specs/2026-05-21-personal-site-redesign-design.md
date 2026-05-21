# sys0dm1n.github.io — redesign (Executive Light)

**Date:** 2026-05-21
**Owner:** Alain C. (`@sys0dm1n`)
**Status:** Approved design, ready for implementation plan
**Live site:** https://sys0dm1n.github.io/

## Context

The current site is a Jekyll page using the `hacker` remote theme that renders `index.md` as a plain-text CV. The goal is to replace it with a single-page **personal landing site** that reads professional and serious — the kind of page a hiring CTO or senior recruiter would expect from a senior DevOps leader — plus a bot-safe **"Book a meeting"** CTA wired to a Proton Calendar booking link.

Decisions reached during brainstorming:

- **Direction:** Personal landing site (not just a styled CV).
- **Aesthetic:** Executive Light — Stripe/Linear marketing-page feel.
- **Stack:** Custom static site, no Jekyll, no build step, no frameworks.
- **Structure:** Multi-file static (`index.html` + `css/` + `js/`), content authored directly in semantic HTML.
- **Booking:** Proton Calendar booking link, outbound anchor only — no form, no email on the page.

## Goals

- A single-page site that reads as the work of a senior, experienced DevOps leader.
- Clear, scannable hero with a primary `Book a meeting` CTA.
- All current CV content preserved, restructured into modern sections.
- Zero build complexity: edits are direct HTML/CSS/JS file edits; GitHub Pages serves the repo root as-is.
- Bot-safe contact: no email or form on the page; spam protection delegated to Proton Calendar.
- Accessibility: WCAG AA contrast, keyboard navigable, semantic markup.

## Non-goals

- Interactive terminal widget, easter eggs, monospace/"geeky" stylistic flourishes (cut after the direction pivot).
- Blog, writing index, projects gallery, homelab section (out of scope).
- Resume PDF download (cut).
- Email exposure or contact form (cut for bot safety).
- Backend, build tooling, frameworks, or third-party JS beyond Google Analytics.
- Live GitHub stats embed (cut; GitHub is linked but no auto-updating card).

## Architecture

```
/ (repo root, served by GitHub Pages from master)
├── index.html         # all content, semantic HTML
├── css/style.css      # Executive Light theme, responsive
├── js/main.js         # nav scroll-spy, reveal-on-scroll, mobile menu
├── 404.html           # simple, on-brand 404
├── favicon.svg        # restrained "AC" monogram on white
├── og-image.png       # 1200×630, Executive Light, "Alain C. — DevOps Team Lead"
├── .nojekyll          # tells GitHub Pages to serve raw, not run Jekyll
├── README.md          # keep as-is
└── .gitignore         # already includes .superpowers/
```

Files removed: `_config.yml`, `index.md`.

GitHub Pages serves the repo as static files once `.nojekyll` is present. No build step, no plugin install, no remote theme. Google Analytics tag `G-XH22477GS5` is carried over via the standard `gtag` snippet in `<head>` of `index.html` and `404.html`.

## Page sections

Order is top-to-bottom on a single page.

### 1. Sticky navigation

- Left: text mark `Alain C.` linking to `#top`.
- Right (desktop): anchors — `About · Experience · Education · Contact`.
- Primary CTA on the right: `Book a meeting` button (Proton URL).
- Translucent white background, single bottom hairline.
- Under ~720px: collapses to a hamburger; the `Book a meeting` button stays visible outside the menu.

### 2. Hero

- Eyebrow label (small caps, muted): `DEVOPS TEAM LEAD`.
- Heading `<h1>`: `Alain C.`
- Subhead (positioning sentence): `Building reliable cloud platforms and the teams behind them.`
- Meta line: `Beirut · Berlin · 10+ years`.
- Tech chip row (subtle, deemphasised): `AWS · Kubernetes · Terraform · Docker · Ansible · Linux`.
- CTAs:
  - **Primary:** `Book a meeting` → Proton URL, `target="_blank"`, `rel="noopener noreferrer"`.
  - **Secondary:** `LinkedIn` → `https://www.linkedin.com/in/alainch`.
- Generous whitespace; no decorative imagery.

### 3. About

- The existing summary paragraph, lightly tightened for tone (no factual changes).
- Stats strip below the paragraph (large number + small label):
  - `10+` years
  - `4` teams led
  - `3` languages
  - `3` certifications

### 4. Selected highlights

A 2×2 grid of impact cards drawn from existing achievements:

1. **Cut deployment time & AWS cost** — optimised infrastructure and consolidated databases (serVme).
2. **EKS + GitOps migration** — moved from traditional architecture to fully automated CI/CD pipelines (serVme).
3. **Hybrid-cloud migration** — services across AWS, OVH, and Heroku (Keeward).
4. **Built & led DevOps teams** — recruitment, daily standups, retros, 1:1s, mentoring (doctorly + serVme).

On mobile, the grid collapses to a single column.

### 5. Experience

Plain vertical list of all five roles in reverse-chronological order. For each: company, title, dates, location, followed by short bullet groups for responsibilities and achievements (re-using the existing copy). No timeline graphic, no decorative icons.

Roles:

1. **doctorly** — DevOps Team Lead — Mar 2022 – Present — Berlin
2. **serVme** — Lead DevOps Engineer — Dec 2020 – Mar 2022 — Beirut
3. **CMA CGM** — Digital Tech Lead — Feb 2020 – Nov 2020 — Beirut
4. **Inimoney Fintech** — Head of Quality Assurance — Dec 2018 – Jan 2020 — Beirut
5. **Keeward Group** — DevOps System Engineer — Jun 2012 – Jun 2018 — Beirut

### 6. Skills

Categorised columns, plain text labels — no bars, no scores, no badges:

- **Cloud** — AWS
- **Orchestration** — Kubernetes, Docker
- **Infrastructure as code** — Terraform, Ansible
- **CI/CD & GitOps** — GitLab CI/CD, Jenkins, GitOps
- **Systems** — Linux administration, Git
- **Leadership** — Team management, Agile (Scrum/Kanban), Hiring, Mentoring

### 7. Education & Certifications

Two-column compact block on desktop, stacked on mobile.

Education:

- **Conservatoire National des Arts et Métiers** — Analysis and Conception of System Information and Decisions, Computer Science (2008 – 2009)
- **IB Formation, France** — VMware vSphere 4.1 (2011)
- **DIAFOR, France** — System and Network Administration (2007 – 2008)
- **Université de Rennes I** — DEUG, Science (2003 – 2005)

Certifications (rendered as restrained pill badges, no logos):

- Linux Foundation Certified System Administrator (LFCS)
- AWS Certified Solutions Architect – Associate
- Certified Kubernetes Administrator (CKA)

### 8. Languages

A single inline line below certifications:
**Arabic** (native) · **French** (native) · **English** (professional).

### 9. Contact

- Short closing line: "Open to senior DevOps and platform leadership conversations."
- Primary CTA: `Book a meeting`.
- Secondary links: `LinkedIn` and `GitHub @sys0dm1n`.
- No email anywhere — neither visible nor in source.

### 10. Footer

Single line: `© 2026 Alain C.` left; `LinkedIn · GitHub` right.

## Booking button — bot-safe wiring

- **Booking URL:** `https://calendar.proton.me/bookings#Dv2Q_7jlUkUFkPm_nYaAfuSyQcXUWxr8x0z3WEYh89g=`
- Stored as a single `BOOKING_URL` constant near the top of `index.html` (HTML comment marker), so future updates are one edit.
- Rendered as plain `<a href="…" target="_blank" rel="noopener noreferrer">Book a meeting</a>` in three places: nav, hero, contact.
- No form, no JS handler, no email exposed on the page.
- Spam/bot protection is entirely owned by Proton Calendar: their flow has its own anti-abuse, captcha when needed, and email confirmation before the meeting is held.
- Scrapers crawling the page see only an outbound link — there is nothing to harvest.

### Proton Calendar booking page settings (recommended, set inside Proton)

- **Booking page title:** `Book a meeting with Alain`
- **Description:**

  > 30-minute video meeting. Happy to talk about:
  > – DevOps engineering & platform leadership roles
  > – Kubernetes / AWS / Terraform consulting & advisory
  > – Hiring, team building, mentoring
  > – Open-source and community collaboration
  >
  > When booking, please add a quick line about what you'd like to discuss so we can use the time well.
  >
  > Hosted in Europe/Berlin (CET/CEST). If no slot fits your timezone, ping me on LinkedIn and we'll find one.

## Visual system — Executive Light

Tokens (will be CSS variables in `css/style.css`):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | page background |
| `--surface` | `#f8fafc` | card and subtle panel backgrounds |
| `--text` | `#0f172a` | primary text |
| `--muted` | `#475569` | secondary text |
| `--hairline` | `#e2e8f0` | borders, dividers |
| `--accent` | `#1d4ed8` | primary CTA, key links only |
| `--accent-ink` | `#ffffff` | text on accent |

Typography:

- System font stack first: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, system-ui, sans-serif`. No web font load by default.
- Body 17px, line-height 1.6. Headings tracked tight (`letter-spacing: -0.01em`).
- Hierarchy via size + weight + spacing — never via color alone.

Layout:

- Single column, content max-width 760px, centered; horizontal padding scales with viewport.
- Vertical rhythm via generous section padding (96px desktop, 56px mobile).
- Hairline dividers between major sections only where they improve scannability.

Motion:

- Subtle 200ms fade-and-lift on scroll-revealed sections.
- Gated by `prefers-reduced-motion: reduce` — disables animation entirely.
- No parallax, no auto-playing anything.

Responsive breakpoints:

- ≥1024px: comfortable single column with generous gutters.
- 720 – 1023px: same layout, narrower gutters.
- < 720px: hamburger nav; stats strip wraps; highlights grid becomes a single column.

## Accessibility, SEO, ops

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section aria-labelledby="…">`, `<footer>`.
- Heading hierarchy: one `<h1>` (hero), `<h2>` per section, `<h3>` for roles inside Experience.
- Color contrast meets WCAG AA against `--bg`.
- Visible focus rings on all interactive elements — never `outline: none` without an alternative.
- Skip-to-content link as the first focusable element.
- `<title>`: `Alain C. — DevOps Team Lead`.
- `<meta name="description">`: one-sentence professional summary.
- OpenGraph + Twitter card tags with `og-image.png`, so LinkedIn/Slack previews look professional.
- `<html lang="en">`.
- Lighthouse target: ≥ 95 on Performance, Accessibility, Best Practices, and SEO.
- Page weight target: < 60 KB excluding GA script.

## Verification checklist (manual, no test suite)

Run before merge:

- [ ] Site opens at `index.html` locally; all sections render in order.
- [ ] All anchor nav links scroll to their sections.
- [ ] `Book a meeting` button opens the Proton URL in a new tab with no console error.
- [ ] LinkedIn and GitHub links resolve in a new tab.
- [ ] Mobile width (375px): nav collapses, content readable, no horizontal scroll.
- [ ] Keyboard navigation: tab order is logical, focus is visible, skip link works.
- [ ] No console errors, no 404s in the Network panel.
- [ ] GA tag fires (Network panel shows a request to `google-analytics.com` / `googletagmanager.com`).
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] View source: no email address visible anywhere in HTML.
- [ ] LinkedIn Post Inspector shows the correct OG image and description.

## Open items

None — the design is fully specified. The Proton booking page title and description in this spec are recommendations the user can adjust inside Proton without changing any site code.
