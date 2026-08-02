# Plans

The single source of truth for the izkor project. Every architectural and product decision made during planning is persisted here so any agent or human can pick up context from these files alone.

## Document index

| Doc | Topic | Status |
|---|---|---|
| [01-vision-and-scope.md](01-vision-and-scope.md) | Objective, users, product decisions, dual-PDF (print vs share) | approved |
| [02-architecture.md](02-architecture.md) | Stack, URL-state wizard, layout model, render worker pipeline | approved |
| [03-data-pipeline.md](03-data-pipeline.md) | Tehillim dataset, itim harvest, letter→psalm/verse mappings | approved |
| [04-fonts.md](04-fonts.md) | Font inventory, curation, embedding strategy | approved |
| [05-folio-wasm.md](05-folio-wasm.md) | Folio WASM integration, RenderSettings, worker protocol | approved |
| [06-accessibility.md](06-accessibility.md) | IS 5568 / WCAG 2.0 AA, Reg-35 widget, statement page | approved |
| [07-firebase.md](07-firebase.md) | Hosting / Firestore / Storage / Auth, share-link flow | approved |
| [08-phases.md](08-phases.md) | Execution phases 1–7, mapping to `todo/` files | in-progress |

## Status vocabulary

- **draft** — being written, not yet approved
- **approved** — reviewed and locked; changes require a deliberate edit + status bump
- **implemented** — built and verified; the code is now the truth, doc kept for history
- **superseded** — replaced by a newer doc; kept for the record

## How to contribute

1. Keep docs terse and factual — decisions, not prose.
2. Update the index table when adding/renaming a doc.
3. `todo/` tracks *doing*; `plans/` tracks *decided*. Don't duplicate.
4. Doc changes commit directly to `main` (`docs:` conventional prefix).
