// server.js - static file server + POST /save for the folio-wasm spike.
// Serves folio.wasm with the correct MIME type (required by
// WebAssembly.instantiateStreaming). POST /save {name, base64} writes
// decoded bytes into out/.
//
// Usage: node server.js [port]   (default 8321)

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.argv[2] || 8321);
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".wasm": "application/wasm",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".md": "text/plain; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/save") {
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      const { name, base64 } = JSON.parse(body);
      if (!/^[\w.-]+\.pdf$/.test(name)) throw new Error("bad filename: " + name);
      const outDir = path.join(ROOT, "out");
      fs.mkdirSync(outDir, { recursive: true });
      const buf = Buffer.from(base64, "base64");
      fs.writeFileSync(path.join(outDir, name), buf);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, bytes: buf.length }));
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
    }
    return;
  }

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  if (filePath === ROOT) filePath = path.join(ROOT, "harness.html");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("folio-wasm spike server: http://localhost:" + PORT + "/");
});
