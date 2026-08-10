# Phase 6 - i18n / l10n Completion + Polish

Branch: `feat/i18n-and-share` · Worktree: `.claude/worktrees/feat-i18n-and-share` · Depends on: P3 (builder), P1-04 (i18n skeleton)

## P6-01 Complete UI dictionaries (en, es, fr)
Status: done | Owner: Agent E | Started: 2026-08-03 | Done: 2026-08-03 | Deps: P1-04
Details: all wizard/labels/errors/statement strings; he default + en + es + fr complete; Spanish = UI-only (no Spanish Tanakh - psalm text stays Hebrew).
- [x] dictionaries 100% coverage (lint rule for missing keys)
- [x] locale persistence + picker (respect `dir` per locale)

## P6-02 RTL/LTR QA
Status: done | Owner: Agent E | Started: 2026-08-03 | Done: 2026-08-03 | Deps: P6-01
Details: RTL (he) + LTR (en/es/fr) layout passes at 375px/desktop; logical props audit; Playwright snapshot matrix per locale.
- [x] snapshots green for all locales

## P6-03 PWA
Status: done | Owner: Agent E | Started: 2026-08-03 | Done: 2026-08-03 | Deps: -
Details: vite-plugin-pwa; installable; offline shell (app shell only - sheet generation needs network for Firebase, fonts cached).
- [x] installable + offline shell verified

## P6-04 Share/print polish
Status: done | Owner: Agent E | Started: 2026-08-03 | Done: 2026-08-03 | Deps: P3
Details: share link UX (copy button, WhatsApp share intent), filename scheme (`izkor-<name>.pdf`, `izkor-<name>-mobile.pdf`), print button (`window.print()` / open PDF), download via showSaveFilePicker fallback.
- [x] share + download + print flows polished
