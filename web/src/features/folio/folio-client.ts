/**
 * FolioClient: main-thread client for the Folio WASM worker.
 *
 * Spawns the worker lazily, keeps it warm between renders, and exposes
 * render() with progress callbacks. cancel() terminates the worker and
 * rejects in-flight work; the next render respawns and re-warms.
 */

import FolioWorker from '@/features/folio/folio.worker?worker'

export interface FolioRenderSettings {
  /** Folio pageSize fallback; the captured @page CSS overrides it. */
  pageSize?: 'a4' | 'letter' | string
  pdfTitle?: string
  pdfProfile?: string
}

export interface FolioRenderResult {
  /** Base64-encoded PDF bytes. */
  pdf: string
  pages: number
  size: string
  width: number
  height: number
  benchmark?: number
}

export interface FolioProgress {
  phase: 'fonts' | 'render'
}

type Pending = {
  resolve: (value: FolioRenderResult) => void
  reject: (reason: Error) => void
  onProgress?: (progress: FolioProgress) => void
}

export class FolioClient {
  private worker: Worker | null = null
  private nextId = 1
  private pending = new Map<number, Pending>()
  private warming: Promise<void> | null = null

  private spawn(): Worker {
    const worker = new FolioWorker()
    worker.onmessage = (event: MessageEvent) => {
      const message = (event.data ?? {}) as Record<string, unknown>
      const pending = this.pending.get(message.id as number)
      if (!pending) return
      switch (message.type) {
        case 'ack':
        case 'progress':
          pending.onProgress?.(message as unknown as FolioProgress)
          break
        case 'result': {
          this.pending.delete(message.id as number)
          pending.resolve(message as unknown as FolioRenderResult)
          break
        }
        case 'error': {
          this.pending.delete(message.id as number)
          pending.reject(new Error(String(message.message ?? 'folio render failed')))
          break
        }
      }
    }
    worker.onerror = (event: ErrorEvent) => {
      for (const [id, pending] of this.pending) {
        this.pending.delete(id)
        pending.reject(new Error(`folio worker error: ${event.message ?? 'unknown'}`))
      }
    }
    return worker
  }

  private getWorker(): Worker {
    if (!this.worker) this.worker = this.spawn()
    return this.worker
  }

  /** Boot the wasm in the background (renders an empty document). */
  warm(): Promise<void> {
    if (!this.warming) {
      this.warming = new Promise<void>((resolve, reject) => {
        const id = this.nextId++
        this.pending.set(id, {
          resolve: () => resolve(),
          reject,
          onProgress: undefined,
        })
        this.getWorker().postMessage({
          type: 'render',
          id,
          html: '<html><body></body></html>',
          settings: { pageSize: 'a4' },
        })
      })
    }
    return this.warming
  }

  render(
    html: string,
    settings: FolioRenderSettings = {},
    onProgress?: (progress: FolioProgress) => void,
  ): Promise<FolioRenderResult> {
    const id = this.nextId++
    const worker = this.getWorker()
    return new Promise<FolioRenderResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress })
      worker.postMessage({ type: 'render', id, html, settings })
    })
  }

  /** Terminate the worker and reject in-flight work. */
  cancel(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    for (const [id, pending] of this.pending) {
      this.pending.delete(id)
      pending.reject(new Error('cancelled'))
    }
    this.warming = null
  }
}

/** Process-wide singleton: one worker, one warm wasm instance. */
export const folioClient = new FolioClient()

// Dev-only hook for end-to-end debugging from the console.
if (import.meta.env.DEV) {
  ;(globalThis as { __folioClient?: FolioClient }).__folioClient = folioClient
}
