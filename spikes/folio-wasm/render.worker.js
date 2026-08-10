// render.worker.js - Folio WASM worker (Phase 2 spike).
//
// Bootstraps wasm_exec.js + folio.wasm inside a dedicated Web Worker and
// implements the message protocol from plans/05-folio-wasm.md:
//
//   main -> worker: {type:"render", id, html, settings}
//   worker -> main: {type:"ack", id} | {type:"progress", id, phase:"fonts"|"render"}
//                   | {type:"result", id, pdf, pages, size, width, height}
//                   | {type:"error", id, message}
//
// The Go instance stays warm between renders (go.run() blocks forever).
// Cancel is handled on the main thread (terminate + respawn, see folio-loader.js).
// fontBaseDir is Node-only - in the browser, @font-face src must be data URIs
// or relative URLs that this worker rewrites (fetch -> base64), cached in memory.

"use strict";

importScripts("wasm_exec.js"); // defines globalThis.Go

let bootPromise = null;
let inFlight = null;

function boot() {
  return (async () => {
    const resp = await fetch("folio.wasm");
    if (!resp.ok) throw new Error("fetch folio.wasm failed: " + resp.status);
    const go = new Go();
    const { instance } = await WebAssembly.instantiateStreaming(resp, go.importObject);
    go.run(instance); // registers globalThis.folioRender; never returns
  })();
}

function ensureBooted() {
  if (!bootPromise) bootPromise = boot();
  return bootPromise;
}

// Font rewrite cache: url -> data URI. In-memory for the spike; Phase 3 will
// back this with Cache API / IndexedDB so each font is fetched once per app
// lifetime, not once per render.
const fontCache = new Map();
const fontUrlRe = /url\(["']?([^"')]+)["']?\)/g;

async function inlineFontFaces(html) {
  if (!html.includes("@font-face")) return html;
  const urls = new Set();
  for (const m of html.matchAll(fontUrlRe)) {
    const u = m[1];
    if (u.startsWith("data:")) continue;
    urls.add(u);
  }
  if (urls.size === 0) return html;

  const byUrl = new Map();
  for (const u of urls) {
    let dataUri = fontCache.get(u);
    if (!dataUri) {
      const resp = await fetch(u);
      if (!resp.ok) throw new Error("fetch font failed: " + u + " (" + resp.status + ")");
      const buf = await resp.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      const ext = u.split(".").pop().toLowerCase();
      const mime = ext === "woff2" ? "font/woff2" : ext === "woff" ? "font/woff" : ext === "otf" ? "font/otf" : "font/truetype";
      dataUri = "data:" + mime + ";base64," + b64;
      fontCache.set(u, dataUri);
    }
    byUrl.set(u, dataUri);
  }
  return html.replace(fontUrlRe, (full, u) => {
    if (!u.startsWith("data:") && byUrl.has(u)) return 'url("' + byUrl.get(u) + '")';
    return full;
  });
}

function post(msg) {
  self.postMessage(msg);
}

self.onmessage = async (e) => {
  const msg = e.data || {};
  if (msg.type !== "render") return;
  if (inFlight) {
    post({ type: "error", id: msg.id, message: "busy: one render at a time" });
    return;
  }
  inFlight = msg.id;
  post({ type: "ack", id: msg.id });

  try {
    await ensureBooted();

    let html = msg.html;
    let needsFonts = html.includes("@font-face");
    if (needsFonts) {
      post({ type: "progress", id: msg.id, phase: "fonts" });
      html = await inlineFontFaces(html);
    }
    post({ type: "progress", id: msg.id, phase: "render" });

    const result = await globalThis.folioRender(html, JSON.stringify(msg.settings || {}));
    if (result && result.error) throw new Error(result.error);

    post({
      type: "result",
      id: msg.id,
      pdf: result.pdf,
      pages: result.pages,
      size: result.size,
      width: result.width,
      height: result.height,
      benchmark: result.benchmark,
    });
  } catch (err) {
    post({ type: "error", id: msg.id, message: String((err && err.message) || err) });
  } finally {
    inFlight = null;
  }
};
