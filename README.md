# izkor (יזכור)

Generate a printable yahrzeit sheet (יזכור) from a deceased person's Hebrew name — psalms, liturgy, and prayers per Jewish tradition — rendered to PDF entirely in the browser (Go → WASM via folio.wasm).

## Repo map

- [`plans/`](plans/) — the full project plan (single source of truth, all decisions persisted here)
- [`todo/`](todo/) — multi-agent task tracking (fast-changing; commits go straight to `main`)
- `web/` — Vite + React + TS application (Phases 1+; not yet scaffolded)

## Conventions

- Conventional Commits; branch/worktree naming per `conventional-git`
- `todo/` and `plans/` changes commit directly to `main`; code lives on feature branches in `.claude/worktrees/`
- See [`todo/README.md`](todo/README.md) for the multi-agent coordination protocol

## Status

Planning complete, docs committed, Phases 1–2 in progress.
