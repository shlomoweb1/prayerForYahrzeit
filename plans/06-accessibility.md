# 06 — Accessibility

Baseline: **IS 5568 (Israeli standard, aligned to WCAG 2.0 AA)** — legal requirement under the Equal Rights for Persons with Disabilities Act (Israel). Skill reference: `israeli-accessibility-compliance`.

## Non-negotiables

- Skip link, positioned with `inset-inline-start` (RTL-safe)
- One `fieldset`/`legend` per wizard step; `aria-live` regions for dynamic feedback; focus management per step transition
- Contrast ≥ 4.5:1 (text) / 3:1 (UI) — enforced by axe in CI
- All labels/errors in Hebrew (default locale)
- Logical CSS properties everywhere (RTL-safe); **no hard px** — rem tokens (100–150% text scaling must not break layout)

## Reg-35 preferences widget (not a mock overlay — real classes)

Real implementation classes the user's device preferences; versioned localStorage key (device preference → **not** in URL).

- toggles: high contrast / high-invert (mono), text size 100–150%, line/word/letter spacing, readable font, highlight links, highlight headings, large cursor, stop animations, reset all
- `Alt+A` opens it (listen via `e.code === "KeyA" && e.altKey`)
- FOUC prevention: bootstrap `<script>` in `<head>` applies saved classes before first paint
- Print-CSS reset: a11y classes must not leak into the generated PDF HTML (clean capture)
- Accessibility statement page links here; widget available on every page

## Accessibility statement page (`/accessibility`, mandatory)

Conformance (IS 5568/WCAG 2.0 AA), features provided (incl. widget), **honest known limitations** (e.g. PDF accessibility status — screen-reader support in generated PDFs is limited; NVDA-tested), feedback channel, last audit date, date of statement. Footer link from every page.

## PDF accessibility

- `pdfTitle` metadata set; language metadata (`he`)
- Generated PDFs: test with NVDA; document results in the statement (limitations section)
- If PDF SR support is poor, mitigation = alternate accessible HTML view of the sheet content (keep as P1 fallback decision at launch)

## Testing & CI gates

- CI: eslint a11y rules + axe-core (`@axe-core/playwright`) ≥ 0 violations, Lighthouse ≥ 95 (a11y + best practices), Playwright snapshots at **375px mobile + desktop + RTL**, keyboard-only flows
- Manual matrix before launch: NVDA (Windows), JAWS, VoiceOver (macOS/iOS), TalkBack (Android)
- IS 5568 explicit checklist item in Phase 7 (see `todo/phase-07-a11y-launch.md`)
