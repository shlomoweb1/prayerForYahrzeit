/**
 * Folio WASM render worker — port of spikes/folio-wasm/render.worker.js.
 *
 * Loaded as an IIFE classic worker (`?worker`, Vite's default format) so
 * importScripts works. Bootstraps wasm_exec.js + folio.wasm and keeps the Go
 * instance warm between renders. The HTML it receives already has every
 * @font-face source embedded as a base64 data URI (renderSheetHTML.tsx) — the
 * captured document has no URL resolution, so fonts must arrive pre-embedded
 * rather than being fetched here.
 *
 * main -> worker: {type:"render", id, html, settings}
 * worker -> main: {type:"ack", id} | {type:"progress", id, phase:"render"}
 *                  | {type:"result", id, pdf, pages, size, width, height}
 *                  | {type:"error", id, message}
 *
 * Cancel is handled on the main thread (terminate + respawn, folio-client.ts).
 */

/// <reference lib="webworker" />

import { WASM_VERSION } from './generated/wasm-version'

declare const self: DedicatedWorkerGlobalScope

interface GoRuntime {
  new (): {
    importObject: WebAssembly.Imports
    run: (instance: WebAssembly.Instance) => void
  }
}

interface RenderResult {
  pdf?: string
  pages?: number
  size?: string
  width?: number
  height?: number
  benchmark?: number
  error?: string
}

async function loadWasmExec(): Promise<void> {
  const url = `/wasm/wasm_exec.js?v=${WASM_VERSION['wasm_exec.js']}`
  const scope = self as unknown as { importScripts?: (...urls: string[]) => void }
  if (typeof scope.importScripts === 'function') {
    try {
      scope.importScripts(url)
      return
    } catch {
      // Module workers throw from importScripts; fall through to fetch + eval.
    }
  }
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`fetch wasm_exec.js failed: ${resp.status}`)
  ;(0, eval)(await resp.text())
}

let bootPromise: Promise<void> | null = null
let inFlight: number | null = null

async function boot(): Promise<void> {
  await loadWasmExec()
  const resp = await fetch(`/wasm/folio.wasm?v=${WASM_VERSION['folio.wasm']}`)
  if (!resp.ok) throw new Error(`fetch folio.wasm failed: ${resp.status}`)
  const Go = (self as unknown as Record<string, GoRuntime>).Go
  if (!Go) throw new Error('Go runtime not available after wasm_exec.js load')
  const go = new Go()
  const { instance } = await WebAssembly.instantiateStreaming(resp, go.importObject)
  go.run(instance)
}

function ensureBooted(): Promise<void> {
  if (!bootPromise) bootPromise = boot()
  return bootPromise
}

function post(message: Record<string, unknown>): void {
  self.postMessage(message)
}

self.onmessage = (event: MessageEvent) => {
  const message = (event.data ?? {}) as Record<string, unknown>
  if (message.type !== 'render') return
  if (inFlight !== null) {
    post({ type: 'error', id: message.id, message: 'busy: one render at a time' })
    return
  }
  inFlight = message.id as number
  post({ type: 'ack', id: message.id })

  void (async () => {
    try {
      await ensureBooted()
      const html = String(message.html ?? '')
      post({ type: 'progress', id: message.id, phase: 'render' })

      const render = (self as unknown as Record<string, unknown>).folioRender
      if (typeof render !== 'function') throw new Error('folioRender is not available in the worker')
      const result = (await (render as (html: string, settings: string) => Promise<RenderResult>)(
        html,
        JSON.stringify(message.settings ?? {}),
      )) as RenderResult
      if (result?.error) throw new Error(result.error)

      post({
        type: 'result',
        id: message.id,
        pdf: result.pdf,
        pages: result.pages,
        size: result.size,
        width: result.width,
        height: result.height,
        benchmark: result.benchmark,
      })
    } catch (err) {
      post({ type: 'error', id: message.id, message: String((err as Error)?.message ?? err) })
    } finally {
      inFlight = null
    }
  })()
}
