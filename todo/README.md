# Todo - multi-agent coordination protocol

This folder is the coordination layer for parallel agents working on izkor. It is the **only** place where task state lives - no hidden state files, no external trackers.

## Task file layout

One file per phase: `phase-01-scaffold.md` … `phase-07-a11y-launch.md`.

Each task:

```md
## P1-01 Vite scaffold
Status: in-progress | Owner: <agent-name> | Started: 2026-08-02 | Deps: -
Details: ...
- [ ] subtask
```

## Statuses

`pending` → `in-progress` → `done` | `blocked` | `cancelled`

## Protocol

1. **Claiming** - before starting work, edit the task to `in-progress`, set `Owner` and `Started`, and commit. That commit is the lock; don't duplicate work already claimed.
2. **Sync** - `todo/` and `plans/` commits go **directly to `main`** (docs-only, allowed anytime). Code lives on feature branches. Pull `main` before claiming a task (`git merge main`).
3. **Blockers** - set task `blocked` with a reason and what would unblock it. Grep for `blocked` on pickup.
4. **Done** - mark `done` with a one-line summary of what was built/verified. The commit that completes the task references the id (`Closes` style is optional; plain `P1-01` in subject/body is fine).
5. **Task ids** - `P<phase>-<nn>` referenced from commits, e.g. `feat(scaffold): add vite template (P1-01)`.

## Worktree map

| Branch | Worktree | Workstream |
|---|---|---|
| `feat/web-scaffold` | `.claude/worktrees/feat-web-scaffold` | Phase 1 web scaffold |
| `feat/folio-spike` | `.claude/worktrees/feat-folio-spike` | Phase 2 WASM spike |
| `feat/data-pipeline` | `.claude/worktrees/feat-data-pipeline` | Phase 3 data prep |

Keep one branch per worktree. Remove the worktree after the branch merges (`git worktree remove` + `git worktree prune`).
