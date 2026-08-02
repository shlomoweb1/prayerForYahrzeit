# 07 — Firebase

Full Firebase (no custom backend). Project name TBD at setup (`firebase use --add`).

## Services

| Service | Use |
|---|---|
| **Hosting** | SPA (Vite build). Cache headers: long-lived immutable for `/assets/*`, wasm (never revalidate — content-hashed), fonts (immutable). |
| **Firestore** | `sheets/{uid}` — persisted sheet config + generated metadata |
| **Storage** | Generated share PDFs (e.g. `pdfs/<uid>/<sheetId>.pdf`) — public read via signed/short-lived URLs or public bucket rules (decide at implementation; PDFs are non-sensitive but should not be indexable) |
| **Auth** | Google sign-in optional; anonymous auth is enough to save sheets. No hard auth wall. |
| **Analytics** | Privacy-lean events (step funnel, generate success/failure, share). |

## Firestore schema

```
sheets/{sheetId}
  uid: string                  # owner (anon uid)
  createdAt / updatedAt: timestamp
  name, parent: string         # Hebrew names
  gender: "male" | "female"
  nusach: "ashkenaz" | "sefard"
  settings: { target, paper, font, nikud, deco, acrostic, sections: [] }
  share: { storagePath, url, createdAt } | null
```

## Share flow (Share PDF)

1. Generate in browser (folio wasm) → Blob
2. Upload `pdfs/<uid>/<sheetId>-share.pdf` to Storage
3. Write/update `sheets/{sheetId}` doc (create if new)
4. UI copies share link (`https://<project>.web.app/s/{sheetId}` or Storage URL — decide at implementation)
5. Recipient opens link → PDF renders in any phone viewer **offline-capable** (fonts embedded — no network needed for the PDF itself)

## Auth UX

- Anonymous session by default; "save to account" CTA upgrades to Google sign-in (preserves sheet history)
- `sheets` queried by `uid` for history UI (step 7 → saved sheets list)

## Security rules

- `sheets`: read/write own `uid` only; public read via `share` flag if we want server-free share pages (else Storage URL suffices)
- Storage: per-owner prefix; shared files public-read
- No sensitive data in this app — still apply least-privilege.

## Analytics events (privacy-lean, no PII)

`wizard_step`, `generate_start`, `generate_success`, `generate_error`, `share_link_copied`, `pdf_downloaded`, `pdf_printed`, `a11y_widget_opened`.
