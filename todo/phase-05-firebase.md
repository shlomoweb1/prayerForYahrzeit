# Phase 5 — Firebase

Branch: `feat/firebase` · Worktree: `.claude/worktrees/feat-firebase` · Depends on: P1-08 (project init), P3 (generate flow)

## P5-01 Hosting config + cache headers
Status: pending | Owner: — | Started: — | Deps: P1-08
Details: SPA rewrite; immutable long cache for /assets/* + wasm + fonts (content-hashed); security headers.
- [ ] firebase.json (hosting) + headers verified in staging

## P5-02 Firestore schema + rules
Status: pending | Owner: — | Started: — | Deps: —
Details: `sheets/{sheetId}` per plans/07; rules: own-uid read/write; share flag for public reads (decide share-page vs Storage URL).
- [ ] schema types + rules deployed
- [ ] sheets list (history) UI in step 7

## P5-03 Storage share flow
Status: pending | Owner: — | Started: — | Deps: P3 generate flow
Details: upload share PDF `pdfs/<uid>/<sheetId>-share.pdf`; link copy UX; rules per-owner prefix + public-read for shared.
- [ ] generate → upload → copy link end-to-end in staging

## P5-04 Auth (anonymous + Google)
Status: pending | Owner: — | Started: — | Deps: —
Details: anonymous session by default; "save to account" upgrade to Google sign-in preserving sheets; sign-out.
- [ ] auth flow + sheet ownership migration tested

## P5-05 Analytics events
Status: pending | Owner: — | Started: — | Deps: P1-08
Details: privacy-lean events (wizard_step, generate_start/success/error, share_link_copied, pdf_downloaded, pdf_printed, a11y_widget_opened); no PII.
- [ ] events wired + verified in debug view
