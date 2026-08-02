// harness.js — drives the Phase 2 spike tests in the browser.
// Run tests with buttons, or auto-run via ?test=<name> (or ?test=all).

"use strict";

const Harness = (function () {
  const SETTINGS = {
    pageSize: "a4",
    mediaType: "print",
    pdfProfile: "",
    pdfTitle: "Folio WASM spike",
    ignoreResourceErrors: false,
    cssDpi: 96,
    benchmark: true,
  };

  const client = FolioLoader.create();

  // ---- fonts ---------------------------------------------------------------

  let fontCache = null;
  async function fonts() {
    if (fontCache) return fontCache;
    const [regular, bold] = await Promise.all([
      Capture.fontToDataUri("assets/NotoSerifHebrew-Regular.ttf"),
      Capture.fontToDataUri("assets/NotoSerifHebrew-Bold.ttf"),
    ]);
    fontCache = [
      { family: "NotoSerifHebrew", weight: "normal", style: "normal", dataUri: regular },
      { family: "NotoSerifHebrew", weight: "bold", style: "normal", dataUri: bold },
    ];
    return fontCache;
  }

  // ---- sheet content (shared by capture + deco tests) -----------------------

  const PRAYER_WORDS = ["יְהִי", "רָצוֹן", "מִלְּפָנֶיךָ", "יְיָ", "אֱלֹהַי", "וֵאלֹהֵי", "אֲבוֹתַי"];
  const NAME_WORDS = ["אַבְרָהָם", "בֶּן", "יִצְחָק"];
  const PLAIN_NIKUD = "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ.";
  const PLAIN_NO_NIKUD = "שלום עולם";

  function sheetCss() {
    return (
      ".sheet{font-family:'NotoSerifHebrew',serif;direction:rtl;text-align:center;" +
      "color:#111;box-sizing:border-box;padding:48px 32px;background:#fff;}\n" +
      ".head{font-size:20px;font-weight:700;margin-bottom:24px;}\n" +
      ".deco-line{font-size:26px;line-height:1.7;margin-bottom:20px;}\n" +
      ".plain{font-size:24px;line-height:1.9;margin:14px 0;}\n" +
      ".foot{margin-top:32px;font-size:18px;color:#444;}"
    );
  }

  function buildDecoBlock(opts) {
    opts = opts || {};
    const deco = Capture.decorateWords(PRAYER_WORDS, { reversed: opts.reversed, decoRatio: 1.9 });
    const name = Capture.decorateWords(NAME_WORDS, { reversed: opts.reversed, decoRatio: 1.9 });
    return (
      '<div class="sheet">' +
      '<div class="head">לְעִילּוּי נִשְׁמַת</div>' +
      '<div class="deco-line">' + name + "</div>" +
      '<div class="deco-line">' + deco + "</div>" +
      '<p class="plain">' + PLAIN_NIKUD + "</p>" +
      '<p class="plain">' + PLAIN_NO_NIKUD + "</p>" +
      '<div class="foot">נֵר נִשְׁמָה</div>' +
      "</div>"
    );
  }

  // ---- capture test ---------------------------------------------------------

  async function runCapture() {
    const fontsArr = await fonts();
    const host = Capture.mountOffscreen("spike-host");
    const pageCss =
      ".page{width:" + Capture.A4_WIDTH_PX + "px;height:" + Capture.A4_HEIGHT_PX + "px;" +
      "overflow:hidden;box-sizing:border-box;}";
    host.innerHTML =
      '<style>' + sheetCss() + "</style>" +
      '<div class="page">' +
      buildDecoBlock({}) +
      '<p class="plain">עמוד ראשון — דף זיכרון לדוגמה.</p>' +
      "</div>" +
      '<div class="page" style="page-break-before:always;">' +
      '<div class="sheet"><div class="head">עמוד שני</div>' +
      '<p class="plain">' + PLAIN_NIKUD + "</p>" +
      '<p class="plain">תהא נשמתו צרורה בצרור החיים.</p>' +
      "</div></div>";

    const captured = await Capture.capture("spike-host");
    const wrapped = Capture.wrapDocument({
      pageCss: "@page{size:210mm 297mm;margin:0;}",
      styles: pageCss + "\n" + sheetCss(),
      fonts: fontsArr,
      title: "Folio spike — capture pipeline",
      bodyHtml: captured.pages.map((p) => '<div class="page">' + p + "</div>").join("\n"),
    });

    const settings = Object.assign({}, SETTINGS, { pdfTitle: "Folio spike capture" });
    const result = await renderAndSave("sheet.pdf", wrapped, settings, { progress: true });
    return {
      result,
      expected: 2,
      ok: result.pages === 2,
      note: "captured pages: " + captured.pages.length,
    };
  }

  // ---- decorated word tests ---------------------------------------------------

  async function runDeco(reversed) {
    const name = reversed ? "deco-reversed" : "deco-logical";
    const fontsArr = await fonts();
    const wrapped = Capture.wrapDocument({
      pageCss: "@page{size:210mm 297mm;margin:0;}",
      styles: sheetCss(),
      fonts: fontsArr,
      title: "Folio spike — decorated words (" + name + ")",
      bodyHtml: buildDecoBlock({ reversed }),
    });
    const settings = Object.assign({}, SETTINGS, { pdfTitle: "Folio deco " + name });
    const result = await renderAndSave(name + ".pdf", wrapped, settings, { progress: true });
    // show the same block on-screen for comparison
    showPreview(buildDecoBlock({ reversed }));
    return { result, ok: result.pages >= 1 };
  }

  // ---- hello test -------------------------------------------------------------

  async function runHello() {
    const fontsArr = await fonts();
    const wrapped = Capture.wrapDocument({
      pageCss: "@page{size:A4 portrait;margin:0;}",
      styles: "p{font-family:'NotoSerifHebrew',serif;font-size:28px;direction:rtl;text-align:center;margin:48px 0;}",
      fonts: fontsArr,
      title: "Folio hello",
      bodyHtml: "<p>שלום עולם</p><p>בָּרוּךְ אַתָּה</p>",
    });
    const settings = Object.assign({}, SETTINGS, { pdfTitle: "Folio hello" });
    const result = await renderAndSave("hello.pdf", wrapped, settings, { progress: true });
    return { result, ok: result.pages >= 1 };
  }

  // ---- custom page size tests ---------------------------------------------------

  async function runPhone() {
    const fontsArr = await fonts();
    const wrapped = Capture.wrapDocument({
      pageCss: "@page{size:1080px 1920px;margin:0;}",
      styles:
        "p{font-family:'NotoSerifHebrew',serif;font-size:44px;direction:rtl;text-align:center;margin:96px 0;}",
      fonts: fontsArr,
      title: "Folio phone size",
      bodyHtml: "<p>לְעִילּוּי נִשְׁמַת</p><p>אַבְרָהָם בֶּן יִצְחָק</p>",
    });
    const settings = Object.assign({}, SETTINGS, { pdfTitle: "Folio phone share" });
    const result = await renderAndSave("phone.pdf", wrapped, settings, { progress: true });
    // 1080px -> 810pt, 1920px -> 1440pt (px*0.75, hardcoded 96dpi)
    const ok = Math.abs(result.width - 810) < 1 && Math.abs(result.height - 1440) < 1;
    return { result, ok, note: "expected 810x1440 pt (1080x1920 px @0.75)" };
  }

  async function runAutoHeight() {
    const fontsArr = await fonts();
    const wrapped = Capture.wrapDocument({
      pageCss: "@page{size:1080px;height:0;}",
      styles:
        "p{font-family:'NotoSerifHebrew',serif;font-size:44px;direction:rtl;text-align:center;margin:96px 0;}",
      fonts: fontsArr,
      title: "Folio autoheight",
      bodyHtml: "<p>אוֹר זָרוּעַ לַצַּדִּיק</p>",
    });
    const settings = Object.assign({}, SETTINGS, { pdfTitle: "Folio autoheight" });
    const result = await renderAndSave("autoheight.pdf", wrapped, settings, { progress: true });
    return { result, ok: result.pages === 1, note: "autoheight: single continuous page" };
  }

  // ---- plumbing ----------------------------------------------------------------

  async function renderAndSave(name, html, settings, opts) {
    opts = opts || {};
    const t0 = performance.now();
    const result = await client.render(html, settings, (m) => {
      if (m.type === "progress") log("    worker: phase=" + m.phase);
    });
    const ms = Math.round(performance.now() - t0);
    const bench = (result.benchmark || []).map((b) => b.name + "=" + b.ms + "ms").join(" ");
    log(
      "    " + name + ": pages=" + result.pages + " size=" + result.size +
      " width=" + result.width + " height=" + result.height +
      " (" + ms + "ms wall)" + (bench ? "\n      spans: " + bench : "")
    );
    const resp = await fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, base64: result.pdf }),
    });
    if (!resp.ok) throw new Error("save failed: " + (await resp.text()));
    return result;
  }

  function showPreview(html) {
    const el = document.getElementById("preview");
    el.hidden = false;
    el.innerHTML =
      "<strong>On-screen reference (same HTML as the PDF):</strong><br>" +
      '<div style="width:794px;margin-top:8px;">' +
      '<style>' + sheetCss() + "</style>" + html +
      "</div>";
  }

  function log(msg) {
    const el = document.getElementById("log");
    el.textContent += "\n" + msg;
    console.log(msg);
  }

  // ---- test runner ---------------------------------------------------------------

  const TESTS = {
    hello: runHello,
    capture: runCapture,
    "deco-logical": () => runDeco(false),
    "deco-reversed": () => runDeco(true),
    phone: runPhone,
    autoheight: runAutoHeight,
  };

  async function runTest(name) {
    if (!TESTS[name]) {
      log("unknown test: " + name);
      return;
    }
    log("\n=== " + name + " ===");
    try {
      const out = await TESTS[name]();
      log("    DONE ok=" + out.ok + (out.note ? " (" + out.note + ")" : ""));
    } catch (err) {
      log("    FAILED: " + err.message);
    }
  }

  function init() {
    document.querySelectorAll("[data-test]").forEach((btn) => {
      btn.addEventListener("click", () => runTest(btn.dataset.test));
    });
    document.getElementById("cancel").addEventListener("click", () => {
      client.cancel();
      log("cancelled (worker terminated + respawned)");
    });
    const params = new URLSearchParams(location.search);
    const t = params.get("test");
    if (t === "all") {
      (async () => {
        for (const name of Object.keys(TESTS)) await runTest(name);
      })();
    } else if (t) {
      runTest(t);
    }
    client.warm().then(() => log("wasm instance warm")).catch((e) => log("warm failed: " + e.message));
  }

  return { init, runTest, log };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", Harness.init);
} else {
  Harness.init();
}
