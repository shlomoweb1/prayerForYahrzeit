# 01 - Vision & Scope

## Objective

A production-grade web service (izkor, יזכור) that turns a deceased person's Hebrew name into a printable **yahrzeit sheet** (יזכור): psalms, prayers, and liturgy per Jewish tradition. HTML→PDF is rendered **entirely in the browser** via Go-compiled `folio.wasm` in a Web Worker - no Go backend.

Target users: non-technical, often elderly; may share sheets via WhatsApp. Design for clarity, big type, zero friction.

## Core product decisions

- **Two PDF types** (dual-PDF):
  - **Print PDF** - A4 (default, Israel/EU) or US Letter; precise physical-print layout; ~10.5–11pt body; 12–15mm margins.
  - **Share PDF** - phone-optimized portrait (~1080×1920 via custom `@page` size), 15–16pt body, ~10mm margins; **fully self-contained** (fonts embedded) so it opens offline on a smartphone, e.g. received via WhatsApp.
  - One shared layout model parameterized by target → two HTML variants → same render engine.
- **Content follows itim.org.il tradition - no guessing.** Harvest texts/mappings from the itim page during implementation (server-rendered; no API).
- **All app state lives in the URL query string** - refresh / back / deep-link safe; modals are URL state too.
- **Mobile-first + RTL**: design from 375px up; logical CSS properties everywhere.
- **Accessibility is a legal requirement** (Israel): IS 5568 / WCAG 2.0 AA baseline; Reg-35 preferences widget; public accessibility statement page.
- i18n: **Hebrew default**; English, Spanish, French UI. Spanish is UI-only (no Spanish Tanakh; French UI + French translations available in dataset).

## Scope (in)

7-step wizard, print + share PDF generation, Firebase storage of generated sheets, share links, a11y compliance, PWA.

## Scope (out)

- Download-in-advance / offline app mode (recipient opens PDF offline - that's the PDF's job, not the app's)
- Admin/backoffice, billing, accounts beyond optional Google sign-in
- Physical mailing/print fulfillment

## Constraints

- No backend server - Firebase only (Hosting, Firestore, Storage, Auth, Analytics).
- Fonts must be license-clean (see `04-fonts.md`) and embedded per-render as data URIs.
- Folio wasm is a fork under `/home/shlomo-framowitz/Developments/tziyun-berega/go-html-to-pdf` - pin a version, commit the built `.wasm` artifact.
