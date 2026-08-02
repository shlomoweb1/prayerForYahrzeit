# Phase 7 — A11y Audit + Launch

Branch: `feat/a11y-launch` · Worktree: `.claude/worktrees/feat-a11y-launch` · Depends on: P3, P6

## P7-01 IS 5568 checklist audit
Status: pending | Owner: — | Started: — | Deps: P3
Details: full WCAG 2.0 AA level-A/AA checklist in RTL Hebrew context; fix findings. Skill: israeli-accessibility-compliance.
- [ ] audit report stored in docs/
- [ ] all findings resolved (or documented rationale)

## P7-02 Screen-reader matrix (manual)
Status: pending | Owner: — | Started: — | Deps: P7-01
Details: NVDA (Windows), JAWS, VoiceOver (macOS/iOS), TalkBack (Android) — wizard flow + generated sheet view; widget keyboard access (Alt+A).
- [ ] 4 platforms documented passes/failures

## P7-03 PDF accessibility testing
Status: pending | Owner: — | Started: — | Deps: P2
Details: generated PDFs with NVDA; pdfTitle + language metadata verified; results documented for the statement (honest limitations).
- [ ] test results in docs/
- [ ] decision: accessible HTML view fallback (P1) — yes/no with rationale

## P7-04 Lighthouse + CI final gates
Status: pending | Owner: — | Started: — | Deps: P7-01
Details: Lighthouse ≥95 (a11y, best practices, SEO) in CI; Playwright full suite (375px, desktop, RTL, all locales smoke).
- [ ] CI green

## P7-05 Statement + launch
Status: pending | Owner: — | Started: — | Deps: P7-02, P7-03
Details: finalize /accessibility statement (conformance, features, limitations, feedback, last audit date); deploy production; post-launch monitoring (Analytics funnel).
- [ ] statement published
- [ ] production live + release notes
