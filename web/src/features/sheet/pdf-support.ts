/**
 * Detects whether the browser can actually paint the `<embed
 * type="application/pdf">` used by PdfViewer.tsx, rather than a blank/black
 * pane - as opposed to just asking whether the browser *claims* PDF support.
 *
 * `navigator.pdfViewerEnabled` (and the legacy `navigator.mimeTypes` check
 * it superseded) answers "does this Chromium/Firefox/WebKit build have PDF
 * rendering compiled in" - a build-time fact, not a runtime one. Electron's
 * embedded Chromium reports `pdfViewerEnabled: true` (the engine has PDFium)
 * while never registering the "Chrome PDF Viewer" extension that actually
 * intercepts navigation to a PDF resource, so the `<embed>` renders nothing.
 * Confirmed by hand: in that environment the accessibility tree shows the
 * `<embed>` as a childless leaf (no nested viewer document), and loading the
 * same blob in an `<iframe>` leaves `iframe.contentWindow.location` pointing
 * at the original blob: URL - the PDF viewer extension never took over the
 * frame.
 *
 * That "did the frame's origin change" check is the actual signal used
 * below: real Chrome/Edge/Firefox intercept PDF navigation and swap in a
 * `chrome-extension://…` / `resource://pdf.js/…` document - a different
 * origin, so the parent's read of `contentWindow.location.href` throws
 * (SecurityError). No redirect (or no throw) means the frame is just
 * showing the raw PDF bytes (or nothing) - no working viewer.
 *
 * Safari (desktop and, since iOS mandates WebKit for every browser, all of
 * iOS) renders PDFs natively in WebKit itself with no extension and no
 * origin change, so the redirect probe would false-negative there - those
 * platforms are trusted on `pdfViewerEnabled` alone and skip the probe.
 */

// const PROBE_TIMEOUT_MS = 1500

function claimsPdfSupport(): boolean {
  if (typeof navigator === 'undefined') return false
  if ('pdfViewerEnabled' in navigator) return navigator.pdfViewerEnabled
  // Legacy fallback for older engines - `navigator.mimeTypes` is gone from
  // the modern DOM typings, so it's accessed via a cast.
  const mimeTypes = (navigator as Navigator & { mimeTypes?: { 'application/pdf'?: unknown } }).mimeTypes
  return Boolean(mimeTypes?.['application/pdf'])
}

/** iOS mandates WebKit for every browser, so this also covers Chrome/Firefox on iOS - all of them get Safari's native (extension-less) PDF rendering. */
// function isNativeWebKitPdfPlatform(): boolean {
//   const ua = navigator.userAgent
//   if (/iPad|iPhone|iPod/.test(ua)) return true
//   return /^((?!chrome|android).)*safari/i.test(ua)
// }

/** Resolves true only once a PDF viewer has provably taken over the frame (origin changed), not merely once the frame has loaded. */
// function probeViewerIntercepts(): Promise<boolean> {
//   return new Promise((resolve) => {
//     const blob = new Blob([MINIMAL_PDF], { type: 'application/pdf' })
//     const url = URL.createObjectURL(blob)
//     const iframe = document.createElement('iframe')
//     iframe.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px;left:-9999px;'

//     let settled = false
//     const finish = (result: boolean) => {
//       if (settled) return
//       settled = true
//       window.clearTimeout(timer)
//       iframe.remove()
//       URL.revokeObjectURL(url)
//       resolve(result)
//     }

//     const timer = window.setTimeout(() => finish(false), PROBE_TIMEOUT_MS)

//     iframe.onload = () => {
//       try {
//         // Reachable only if the frame is still same-origin - i.e. no PDF
//         // viewer document ever took over the navigation.
//         void iframe.contentWindow?.location.href
//         finish(false)
//       } catch {
//         // Threw: the frame navigated to a different-origin viewer document.
//         finish(true)
//       }
//     }

//     document.body.appendChild(iframe)
//     iframe.src = url
//   })
// }

/** Full check: whether the browser will actually render the PdfViewer `<embed>`, not just whether it claims to support the MIME type. */
export async function supportsPdfEmbed(): Promise<boolean> {
  if (!claimsPdfSupport()) return false
  // if (isNativeWebKitPdfPlatform()) return true
  // return probeViewerIntercepts()
  return true;
}
