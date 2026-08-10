// folio-loader.js - thin main-thread loader for the Folio WASM worker.
// Phase 2 spike: ~50 lines, no folio-utils.js (that is Node-oriented).
//
// API:
//   const client = FolioLoader.create();
//   client.render(html, settings, onProgress) -> Promise<result>   // {pdf,pages,size,width,height}
//   client.cancel()                        // terminate + respawn (warm again on next render)
//   client.warm()                          // boot the wasm in the background

"use strict";

(function (global) {
  const FOLIO_WORKER = "render.worker.js";

  class FolioClient {
    constructor() {
      this.worker = null;
      this.nextId = 1;
      this.pending = new Map(); // id -> {resolve, reject, onProgress}
      this.warming = null;
    }

    _spawn() {
      const w = new Worker(FOLIO_WORKER);
      w.onmessage = (e) => {
        const m = e.data || {};
        const p = this.pending.get(m.id);
        if (!p) return;
        switch (m.type) {
          case "ack":
          case "progress":
            if (p.onProgress) p.onProgress(m);
            break;
          case "result":
            this.pending.delete(m.id);
            p.resolve(m);
            break;
          case "error":
            this.pending.delete(m.id);
            p.reject(new Error(m.message || "folio render failed"));
            break;
        }
      };
      w.onerror = (e) => {
        for (const [id, p] of this.pending) {
          this.pending.delete(id);
          p.reject(new Error("worker error: " + (e.message || "unknown")));
        }
      };
      return w;
    }

    _getWorker() {
      if (!this.worker) this.worker = this._spawn();
      return this.worker;
    }

    warm() {
      if (!this.warming) {
        this.warming = new Promise((resolve, reject) => {
          const w = this._getWorker();
          const id = this.nextId++;
          this.pending.set(id, { resolve: () => resolve(), reject, onProgress: null });
          // Renders an empty document to force wasm boot; result discarded.
          w.postMessage({ type: "render", id, html: "<html><body></body></html>", settings: { pageSize: "a4" } });
        });
      }
      return this.warming;
    }

    render(html, settings, onProgress) {
      const id = this.nextId++;
      const w = this._getWorker();
      return new Promise((resolve, reject) => {
        this.pending.set(id, { resolve, reject, onProgress });
        w.postMessage({ type: "render", id, html, settings });
      });
    }

    cancel() {
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
      for (const [id, p] of this.pending) {
        this.pending.delete(id);
        p.reject(new Error("cancelled"));
      }
      this.warming = null;
    }
  }

  global.FolioLoader = { create: () => new FolioClient() };
})(self);
