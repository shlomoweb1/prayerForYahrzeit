// capture.js — off-screen capture pipeline (P2-03) + Hebrew helpers (P2-04).
//
// Pipeline (per plans/02-architecture.md render pipeline):
//   mount off-screen (position:fixed; left:-9999px; width:794px = A4 @96dpi)
//   -> document.fonts.ready -> forced reflow -> 3-frame wait (16ms timer shim)
//   -> innerHTML of explicit page divs + stylesheet capture (cssRules->cssText)
//   -> assemble wrapped document: <html dir="rtl" lang="he"> + @page + inline <style> + data-URI fonts

"use strict";

const Capture = (function () {
  const A4_WIDTH_PX = 794; // 210mm @96dpi
  const A4_HEIGHT_PX = 1123; // 297mm @96dpi

  // ---- mount / teardown -------------------------------------------------

  function mountOffscreen(id) {
    let host = document.getElementById(id);
    if (!host) {
      host = document.createElement("div");
      host.id = id;
      host.style.cssText =
        "position:fixed;left:-9999px;top:0;width:" + A4_WIDTH_PX + "px;background:#fff;z-index:2147483647;";
      document.body.appendChild(host);
    }
    host.innerHTML = "";
    return host;
  }

  function unmount(id) {
    const host = document.getElementById(id);
    if (host) host.remove();
  }

  // ---- stability waits ---------------------------------------------------

  async function waitFonts() {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  }

  function forceReflow(el) {
    void el.offsetHeight; // forced reflow
  }

  // 3 frames with a 16ms timer shim so background tabs still advance.
  async function waitFrames(n) {
    n = n || 3;
    for (let i = 0; i < n; i++) {
      await new Promise((r) =>
        setTimeout(() => requestAnimationFrame(() => r()), 16)
      );
    }
  }

  // ---- stylesheet capture ------------------------------------------------

  function captureStylesheets() {
    const parts = [];
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules;
        for (const rule of rules) parts.push(rule.cssText);
      } catch (err) {
        // cross-origin sheet — skip (all sheets same-origin in this spike)
        console.warn("captureStylesheets: skipped sheet", err);
      }
    }
    return parts.join("\n");
  }

  // ---- font assets ---------------------------------------------------------

  async function fontToDataUri(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("font fetch failed: " + url);
    const buf = await resp.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    const ext = url.split(".").pop().toLowerCase();
    const mime = ext === "woff2" ? "font/woff2" : ext === "woff" ? "font/woff" : ext === "otf" ? "font/otf" : "font/truetype";
    return "data:" + mime + ";base64," + btoa(binary);
  }

  // ---- wrapped document ------------------------------------------------------

  // Port of the fork's wrapExamHTML: @page size/margin 0 + inline <style> +
  // dir="rtl" lang="he" + body reset.
  function wrapDocument({ pageCss, styles, fonts, bodyHtml, title }) {
    const fontFaces = (fonts || [])
      .map(
        (f) =>
          "@font-face{font-family:'" + f.family + "';src:url('" + f.dataUri + "');" +
          "font-weight:" + (f.weight || "normal") + ";font-style:" + (f.style || "normal") + ";}"
      )
      .join("\n");
    return (
      "<!DOCTYPE html>\n<html dir=\"rtl\" lang=\"he\">\n<head>\n" +
      '<meta charset="UTF-8">\n' +
      (title ? "<title>" + title + "</title>\n" : "") +
      "<style>\n" +
      fontFaces + "\n" +
      (pageCss || "") + "\n" +
      "body{margin:0;padding:0;}\n" +
      (styles || "") + "\n" +
      "</style>\n</head>\n<body>\n" +
      bodyHtml + "\n</body>\n</html>"
    );
  }

  // Full capture pipeline for a pre-mounted off-screen host.
  async function capture(id) {
    const host = document.getElementById(id);
    if (!host) throw new Error("capture: host #" + id + " not mounted");
    await waitFonts();
    forceReflow(host);
    await waitFrames(3);
    const pages = Array.from(host.querySelectorAll(".page")).map((p) => p.innerHTML);
    return { pages, styles: captureStylesheets() };
  }

  // ---- Hebrew helpers (P2-04) ---------------------------------------------

  const segmenter = new Intl.Segmenter("he", { granularity: "grapheme" });

  // Split a word into its first grapheme cluster (letter + any nikud marks)
  // and the rest. "בָּרוּךְ" -> ["בָ", "רוּךְ"].
  function splitFirstCluster(word) {
    const parts = Array.from(segmenter.segment(word), (s) => s.segment);
    if (parts.length <= 1) return [word, ""];
    return [parts[0], parts.slice(1).join("")];
  }

  // Simple per-word reversal (cluster-aware).
  function reverseWordClusters(word) {
    const parts = Array.from(segmenter.segment(word), (s) => s.segment);
    return parts.reverse().join("");
  }

  // rtl.js-style reversal of a whole Hebrew run (whole string, cluster-aware).
  function reverseRunClusters(s) {
    const parts = Array.from(segmenter.segment(s), (s) => s.segment);
    return parts.reverse().join("");
  }

  // Wrap each whitespace-separated word in decoration spans:
  //   <span class="word"><span class="deco">בָ</span>רוּךְ</span>
  // Returns HTML; if `reversed` is true the remainder is also pre-reversed
  // (for the "simple reverse" variant of the spike).
  function decorateWords(words, opts) {
    opts = opts || {};
    const decoRatio = opts.decoRatio || 1.9;
    return words
      .map((w) => {
        const [first, rest] = splitFirstCluster(w);
        const body = opts.reversed ? reverseWordClusters(rest) : rest;
        const deco = opts.reversed ? reverseWordClusters(first) : first;
        return (
          '<span class="word" style="display:inline-block;vertical-align:bottom;text-align:center;' +
          'margin-inline-end:0.35em;">' +
          '<span class="deco" style="display:block;font-size:' + decoRatio + 'em;line-height:1.05;' +
          'font-weight:700;">' + deco + "</span>" +
          body +
          "</span>"
        );
      })
      .join(" ");
  }

  return {
    A4_WIDTH_PX,
    A4_HEIGHT_PX,
    mountOffscreen,
    unmount,
    waitFonts,
    forceReflow,
    waitFrames,
    captureStylesheets,
    fontToDataUri,
    wrapDocument,
    capture,
    splitFirstCluster,
    reverseWordClusters,
    reverseRunClusters,
    decorateWords,
  };
})();
