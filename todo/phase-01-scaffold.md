# Phase 1 — Web Scaffold

Branch: `feat/web-scaffold` · Worktree: `.claude/worktrees/feat-web-scaffold` · Depends on: docs (committed)

## P1-01 Vite + React + TS scaffold
Status: pending | Owner: — | Started: — | Deps: —
Details: Vite (react-ts template), strict TS, eslint+prettier, vitest configured, npm scripts (dev/build/test/lint/typecheck).
- [ ] create web/ app
- [ ] CI workflow (lint, typecheck, test, build)

## P1-02 TanStack Router + URL-state wizard schema
Status: pending | Owner: — | Started: — | Deps: P1-01
Details: file-based Router; single zod `WizardQuery` schema (target/paper/gender/nusach/name/parent/font/nikud/deco/acrostic/sections/dialog) wired to `validateSearch`; routes: `/` landing, `/wizard`, `/accessibility`, `/*` 404.
- [ ] router setup + validateSearch
- [ ] 7-step registry skeleton (steps render from `step` param)

## P1-03 Tailwind 4 + shadcn/ui clone with logical props
Status: pending | Owner: — | Started: — | Deps: P1-01
Details: Tailwind v4 CSS-first (@theme, rem tokens). Clone shadcn (Tailwind-4 version) into `components/ui`; convert ALL physical props → logical (pl/pr/ml/mr→ps/pe/ms/me, left/right→start/end, text-left/right→text-start/end, border/rounded-l/r→s/e, inset-x→inset-inline). No hard px.
- [ ] tailwind config (@theme tokens)
- [ ] clone base shadcn set (button, input, select, radio, checkbox, accordion, field, label, card, sheet, dialog, toast)
- [ ] eslint rule enforcing logical props (fails CI)

## P1-04 i18n (react-i18next) — he/en/es/fr
Status: pending | Owner: — | Started: — | Deps: P1-01
Details: he default; en, es, fr skeleton dictionaries; locale picker in UI; RTL `dir` handling per locale (he only). Spanish = UI-only (no Spanish Tanakh).
- [ ] i18n setup + resource modules
- [ ] skeleton dictionaries (wizard strings, common UI, a11y widget strings)

## P1-05 Reg-35 accessibility widget
Status: pending | Owner: — | Started: — | Deps: P1-03
Details: real classes (contrast/high-invert/mono, text 100–150%, spacing, readable font, highlight links/headings, large cursor, stop animations, reset); Alt+A (e.code === "KeyA" && e.altKey); FOUC bootstrap <script> in head; versioned localStorage key; print-CSS reset so classes don't leak into PDF capture.
- [ ] preferences store (localStorage, versioned)
- [ ] widget UI + keyboard support
- [ ] head bootstrap script + print-CSS reset
- [ ] unit tests (prefs round-trip, FOUC class application)

## P1-06 Accessibility statement page
Status: pending | Owner: — | Started: — | Deps: P1-01
Details: `/accessibility` — conformance (IS 5568/WCAG 2.0 AA), features, honest known limitations (PDF SR status placeholder), feedback, last audit date. Footer link on all pages.
- [ ] page content (he/en/es/fr strings)
- [ ] footer link

## P1-07 CI gates (axe, Lighthouse, Playwright)
Status: pending | Owner: — | Started: — | Deps: P1-01, P1-03
Details: @axe-core/playwright ≥0 violations; Lighthouse ≥95 (a11y, best practices); Playwright smoke at 375px mobile + desktop + RTL (he); keyboard-only flow through wizard step 1–3.
- [ ] axe integration
- [ ] Lighthouse CI
- [ ] Playwright matrix (375px, desktop, RTL)

## P1-08 Firebase project init
Status: pending | Owner: — | Started: — | Deps: P1-01
Details: create Firebase project (name TBD), `firebase init hosting`, connect web SDKs (env vars via .env.example), deploy placeholder.
- [ ] project created + hosting init
- [ ] .env.example + SDK wiring
