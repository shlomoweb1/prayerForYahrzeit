# folio.wasm rebuild recipe (P2-01)

Artifacts committed here (in `spikes/folio-wasm/`):

| file | sha256 |
|---|---|
| `folio.wasm` | `a6b197d7abc0153bc499e6b8eb999e00b817a3898ad4f5987f6b114a24340d34` |
| `wasm_exec.js` | `0c949f4996f9a89698e4b5c586de32249c3b69b7baadb64d220073cc04acba14` |
| `folio.d.ts` | tygo-generated API types (reference copy) |

## Source

Fork: `/home/shlomo-framowitz/Developments/tziyun-berega/go-html-to-pdf` (separate
git repo — build artifacts are produced there but NEVER committed there; the
fork's `.bin/` is gitignored).

## Prerequisites

- Go 1.26.3 linux/amd64 (`/usr/local/go/bin/go`). The fork's `Makefile` defaults
  `GO ?= /usr/local/bin/go` which does NOT exist on this machine — always pass
  `GO=/usr/local/go/bin/go`.
- Network access (first run installs `tygo` for `wasm-types`).
- Node v24.18.0 (not needed to build, only to run node-side tests).

## Commands

```bash
cd /home/shlomo-framowitz/Developments/tziyun-berega/go-html-to-pdf
make wasm GO=/usr/local/go/bin/go
```

This runs (in order):
1. `wasm-exec` — copies `wasm_exec.js` + `wasm_exec_node.js` from
   `$(go env GOROOT)/lib/wasm/` of the active toolchain.
2. `wasm-types` — `tygo generate` → `cmd/wasm/.bin/folio.d.ts`.
3. `GOOS=js GOARCH=wasm go build -o ./cmd/wasm/.bin/folio.wasm ./cmd/wasm/`
   → `folio.wasm` (~16 MB, 15,937,152 bytes as built 2026-08-02).

If `tygo` install fails (no network), the type file is unchanged (types.go is
stable) — the wasm build itself can be run standalone:

```bash
GOOS=js GOARCH=wasm /usr/local/go/bin/go build -o ./cmd/wasm/.bin/folio.wasm ./cmd/wasm/
cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" ./cmd/wasm/.bin/wasm_exec.js
```

## Deploying to this spike

```bash
cp <fork>/cmd/wasm/.bin/{folio.wasm,wasm_exec.js,folio.d.ts} spikes/folio-wasm/
sha256sum spikes/folio-wasm/folio.wasm spikes/folio-wasm/wasm_exec.js
# verify against the table above
```

## Serving (important)

`folio.wasm` is fetched with `WebAssembly.instantiateStreaming` — the MIME type
must be `application/wasm` and the page must be served over HTTP. `file://`
will fail. Use the included server:

```bash
cd spikes/folio-wasm && node server.js     # http://localhost:8321
```

(`python3 -m http.server` works for viewing but has no /save endpoint; the
harness needs `POST /save` to write generated PDFs into `out/`.)

## CI note

Pin the Go version (`go1.26.3`); rebuild and update the checksums whenever the
fork's `cmd/wasm` or `layout/` changes. The wasm binary is deterministic per
toolchain (see fork's CLAUDE.md), so the checksum doubles as a provenance check.
