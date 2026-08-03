/**
 * Folio WASM render worker — port of spikes/folio-wasm/render.worker.js.
 *
 * Loaded as an IIFE classic worker (`?worker`, Vite's default format) so
 * importScripts works. Bootstraps wasm_exec.js + folio.wasm, keeps the Go
 * instance warm between renders, and inlines @font-face sources to data URIs
 * (fonts must be embedded — the captured document has no URL resolution).
 *
 * main -> worker: {type:"render", id, html, settings}
 * worker -> main: {type:"ack", id} | {type:"progress", id, phase:"fonts"|"render"}
 *                  | {type:"result", id, pdf, pages, size, width, height}
 *                  | {type:"error", id, message}
 *
 * Cancel is handled on the main thread (terminate + respawn, folio-client.ts).
 */

/// <reference lib="webworker" />

import { inlineFontFaces } from '@/features/folio/font-embedder'

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
  const scope = self as unknown as { importScripts?: (...urls: string[]) => void }
  if (typeof scope.importScripts === 'function') {
    try {
      scope.importScripts('/wasm/wasm_exec.js')
      return
    } catch {
      // Module workers throw from importScripts; fall through to fetch + eval.
    }
  }
  const resp = await fetch('/wasm/wasm_exec.js')
  if (!resp.ok) throw new Error(`fetch wasm_exec.js failed: ${resp.status}`)
  // eslint-disable-next-line no-eval
  ;(0, eval)(await resp.text())
}

let bootPromise: Promise<void> | null = null
let inFlight: number | null = null

async function boot(): Promise<void> {
  await loadWasmExec()
  const resp = await fetch('/wasm/folio.wasm')
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
      let html = String(message.html ?? '')
      if (html.includes('@font-face')) {
        post({ type: 'progress', id: message.id, phase: 'fonts' })
        html = await inlineFontFaces(html)
      }
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
