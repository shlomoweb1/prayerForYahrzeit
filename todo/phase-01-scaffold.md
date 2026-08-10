# Phase 1 - Web Scaffold

Branch: `feat/web-scaffold` · Worktree: `.claude/worktrees/feat-web-scaffold` · Depends on: docs (committed)

## P1-01 Vite + React + TS scaffold
Status: done | Owner: agent-a | Started: 2026-08-02 | Deps: -
Details: Vite (react-ts template), strict TS, eslint+prettier, vitest configured, npm scripts (dev/build/test/lint/typecheck). CI workflow committed.
- [x] create web/ app
- [x] CI workflow (lint, typecheck, test, build)

## P1-02 TanStack Router + URL-state wizard schema
Status: done | Owner: agent-a | Started: 2026-08-02 | Deps: P1-01
Details: file-based Router; single zod `WizardQuery` schema (target/paper/gender/nusach/name/parent/font/nikud/deco/acrostic/sections/dialog) wired to `validateSearch`; routes: `/` landing, `/wizard`, `/accessibility`, `/*` 404.
- [x] router setup + validateSearch
- [x] 7-step registry skeleton (steps render from `step` param)

## P1-03 Tailwind 4 + shadcn/ui clone with logical props
Status: done | Owner: agent-a | Started: 2026-08-02 | Deps: P1-01
Details: Tailwind v4 CSS-first (@theme, rem tokens). Clone shadcn (Tailwind-4 version) into `components/ui`; convert ALL physical props → logical (pl/pr/ml/mr→ps/pe/ms/me, left/right→start/end, text-left/right→text-start/end, border/rounded-l/r→s/e, inset-x→inset-inline). No hard px. `izkor/logical-props` eslint rule enforced (verified: `pl-4`/`text-left` fail with exit 1).
- [x] tailwind config (@theme tokens)
- [x] clone base shadcn set (button, input, select, radio, checkbox, accordion, field, label, card, sheet, dialog, toast)
- [x] eslint rule enforcing logical props (fails CI)

## P1-04 i18n (react-i18next) - he/en/es/fr
Status: done | Owner: agent-a | Started: 2026-08-02 | Deps: P1-01
Details: he default; en, es, fr skeleton dictionaries; locale picker in UI; RTL `dir` handling per locale (he only). Spanish = UI-only (no Spanish Tanakh).
- [x] i18n setup + resource modules
- [x] skeleton dictionaries (wizard strings, common UI, a11y widget strings)

## P1-05 Reg-35 accessibility widget
Status: done | Owner: agent-a | Started: 2026-08-02 | Deps: P1-03
Details: real classes (contrast/high-invert/mono, text 100–150%, spacing, readable font, highlight links/headings, large cursor, stop animations, reset); Alt+A (e.code === "KeyA" && e.altKey); FOUC bootstrap `<script>` in head; versioned localStorage key (`izkor:a11y:v1`); print-CSS reset so classes don't leak into PDF capture.
- [x] preferences store (localStorage, versioned)
- [x] widget UI + keyboard support
- [x] head bootstrap script + print-CSS reset
- [x] unit tests (prefs round-trip, FOUC class application)

## P1-06 Accessibility statement page
Status: done | Owner: agent-a | Started: 2026-08-02 | Deps: P1-01
Details: `/accessibility` - conformance (IS 5568/WCAG 2.0 AA), features, honest known limitations (PDF SR status placeholder), feedback, last audit date. Footer link on all pages.
- [x] page content (he/en/es/fr strings)
- [x] footer link

## P1-07 CI gates (axe, Lighthouse, Playwright)
Status: done | Owner: agent-a | Started: 2026-08-02 | Deps: P1-01, P1-03
Details: @axe-core/playwright ≥0 violations; Lighthouse ≥95 (a11y, best practices); Playwright smoke at 375px mobile + desktop + RTL (he); keyboard-only flow through wizard step 1–3. All 14 e2e tests green locally (desktop + mobile, axe on /, /wizard, /accessibility).
- [x] axe integration
- [x] Lighthouse CI
- [x] Playwright matrix (375px, desktop, RTL)

## P1-08 Firebase project init
Status: blocked | Owner: agent-a | Started: 2026-08-02 | Deps: P1-01
Details: create Firebase project (name TBD), `firebase init hosting`, connect web SDKs (env vars via .env.example), deploy placeholder. BLOCKED on user credentials - `firebase login` is interactive; no project created. Completed offline parts: `web/firebase.json` hosting config (SPA rewrite + cache headers for /assets/*, wasm, fonts), `.env.example` placeholders, `features/firebase` init stub that no-ops gracefully when env vars absent. Unblocked by: user runs `firebase login` and creates project (Phase 5).
- [ ] project created + hosting init (blocked)
- [x] .env.example + SDK wiring (stub)
