import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, DownloadIcon, Loader2, PanelRightClose, Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { buildSheetContent } from '@/features/sheet/content'
import { supportsWasm } from '@/features/folio/wasm-support'
import { useSheetDraft } from '@/features/sheet/from-query'
import { supportsPdfEmbed } from '@/features/sheet/pdf-support'
import { PdfViewer } from '@/features/sheet/PdfViewer'
import { ScaleA4Preview } from '@/features/sheet/ScaleA4Preview'
import { deceasedWord, SheetDocument } from '@/features/sheet/sheet-document'
import { SheetSettingsPanel } from '@/features/sheet/SheetSettingsPanel'
import { downloadPdf, renderPdf, sheetFilename } from '@/features/wizard/sheet-actions'
import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

/** Below 1050px the side menu collapses into an overlay instead of sharing
 * the row with the preview — at narrower widths there isn't room for both
 * without forcing the A4 preview to shrink into illegibility. Tailwind's
 * arbitrary breakpoint `min-[1050px]:` is used inline (not via a template
 * literal) so its JIT scanner can pick up the literal class names. */

/**
 * Fixed edge-tab that opens the settings panel — the one "expand" trigger
 * shared by both layouts: below 1050px it opens the drawer, at/above it
 * re-expands the collapsed inline panel (whose own "hide" control lives in
 * its footer instead). A half-circle bulge on the screen's inline-start
 * edge, vertically centered and pinned through scroll. The two 14px corner
 * squares carve the "reverse" (concave) curve where the bulge meets the flat
 * edge — a notch, not a rounded corner — by painting a quarter-circle in the
 * preview pane's own background color (Tailwind gray-200) over the tab's
 * straight edge. `:dir()` picks which physical corner is concave since the
 * app is bidi (Hebrew RTL + LTR locales) and `inset-inline-start` alone
 * doesn't mirror gradient corners.
 */
const MENU_FAB_CSS = `
.izkor-menu-fab {
  inset-inline-start: 0;
  width: 34px;
  height: 88px;
  border: 1px solid rgb(0 0 0 / 0.1);
  border-inline-start: none;
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  border-start-end-radius: 9999px;
  border-end-end-radius: 9999px;
  background: #fff;
  color: #374151;
  box-shadow: 2px 0 10px rgb(0 0 0 / 0.15);
}
.izkor-menu-fab::before,
.izkor-menu-fab::after {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  width: 14px;
  height: 14px;
  background: #e5e7eb;
}
.izkor-menu-fab::before { top: -14px; }
.izkor-menu-fab::after { bottom: -14px; }
.izkor-menu-fab:dir(ltr)::before { border-bottom-left-radius: 14px; }
.izkor-menu-fab:dir(ltr)::after { border-top-left-radius: 14px; }
.izkor-menu-fab:dir(rtl)::before { border-bottom-right-radius: 14px; }
.izkor-menu-fab:dir(rtl)::after { border-top-right-radius: 14px; }
`

/** Wait this long after the last settings change settles before kicking off
 * a Folio re-render — covers mid-typing in the name/parent fields, not just
 * discrete toggles, so rapid consecutive edits only trigger one render. */
const PDF_RENDER_DEBOUNCE_MS = 650

/**
 * Debounced Folio PDF regeneration for the step-5 preview pane's default
 * (non-editor) mode. Renders `search` to a PDF blob via the existing
 * `renderPdf()` glue, swaps it in as an object URL, and revokes the previous
 * URL right when it's superseded (plus on unmount) so repeated edits don't
 * leak blobs. `enabled=false` (editor mode) skips all of this entirely — no
 * pending timers, no wasted renders.
 *
 * Renders can resolve out of order (a render started earlier isn't
 * guaranteed to finish first), so a monotonically increasing `tokenRef` is
 * stamped on each render *as it actually starts* (i.e. once its debounce
 * window has elapsed without being superseded — see the effect below) and
 * compared against the latest token when it resolves; a result whose token
 * has since been superseded is dropped instead of overwriting the `<embed>`
 * with stale content. `mountedRef` additionally guards against touching
 * state after unmount.
 *
 * On a render failure `failed` flips to true and stays there: the caller
 * uses it to fall back to the live editor-preview instead of leaving a
 * blank/broken pane. This is a safety net, not a retry loop — a genuinely
 * broken Folio pipeline shouldn't keep re-attempting on every keystroke.
 */
function usePdfPreview(search: WizardQuery, enabled: boolean) {
  const [url, setUrl] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [failed, setFailed] = useState(false)
  // The searchKey that `url` was actually rendered from — `loading` is
  // derived by comparing this against the current searchKey below, instead
  // of a separate state flag toggled imperatively (which needed an
  // effect-body `setState` call the linter correctly flags as cascade-prone:
  // https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect).
  const [committedKey, setCommittedKey] = useState<string | null>(null)
  const urlRef = useRef<string | null>(null)
  const tokenRef = useRef(0)
  const mountedRef = useRef(true)

  // Refs must not be written during render (react-hooks/refs) — mirror `url`
  // into the ref from an effect instead.
  useEffect(() => {
    urlRef.current = url
  }, [url])

  // Revoke whatever's still live on unmount — mid-life swaps already revoke
  // their predecessor inline, right after the replacement takes over.
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  const searchKey = JSON.stringify(search)

  useEffect(() => {
    if (!enabled || failed) return
    const timer = window.setTimeout(() => {
      // Stamped here, not when the effect was scheduled: `search` in this
      // closure is whatever was current when THIS timer was set, and the
      // timer only ever fires if no newer change re-ran the effect and
      // cleared it (see the cleanup below) — so it's always the settled,
      // current value at the moment the render actually starts.
      const token = ++tokenRef.current
      const renderedKey = searchKey
      void renderPdf(search)
        .then(({ blob }) => {
          if (!mountedRef.current || tokenRef.current !== token) return
          const next = URL.createObjectURL(blob)
          setUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return next
          })
          setBlob(blob)
          setCommittedKey(renderedKey)
        })
        .catch(() => {
          if (!mountedRef.current || tokenRef.current !== token) return
          setFailed(true)
        })
    }, PDF_RENDER_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
    // searchKey is the real dependency (content equality); `search` itself
    // is a new object most renders and would defeat the debounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, enabled, failed])

  const loading = enabled && !failed && committedKey !== searchKey

  return { url, blob, loading, failed }
}

/**
 * Non-blocking overlay for the case where the PDF itself rendered fine but
 * this browser can't display it inline (see pdf-support.ts) — the editor
 * preview fills the pane underneath so the user isn't left staring at a
 * blank/broken embed, and this floats a compact banner over its bottom edge
 * with a `<Download>` button for whatever the latest render produced.
 * Deliberately not a toast: a toast would auto-dismiss and needs to be
 * re-triggered on every re-render (settings change → new PDF) to stay
 * useful; this just stays put and the button always points at the current
 * `blob`.
 */
function PdfPreviewUnavailableBanner({ blob, filename }: { blob: Blob | null; filename: string }) {
  const { t } = useTranslation()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!blob) return
    setDownloading(true)
    try {
      await downloadPdf(blob, filename)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-4 print:hidden">
      <div className="pointer-events-auto flex items-center gap-3 rounded-lg border bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur">
        <p className="text-sm text-muted-foreground">{t('wizard.fallback.pdfPreviewUnsupported')}</p>
        <Button size="sm" onClick={() => void handleDownload()} disabled={!blob || downloading}>
          <DownloadIcon className="size-4" />
          {downloading ? t('wizard.actions.downloading') : t('wizard.actions.download')}
        </Button>
      </div>
    </div>
  )
}

export function Step5Review({ search, setSearch }: StepProps) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Drives which of the two layouts the shared edge-tab acts on (expand the
  // inline panel vs. open the drawer) — read once at mount, kept in sync by
  // the matchMedia listener below since Tailwind's breakpoint alone doesn't
  // tell the click handler which mode is currently active.
  const [isDesktopMenu, setIsDesktopMenu] = useState(
    () => window.matchMedia('(min-width: 1050px)').matches,
  )

  // Crossing the breakpoint (e.g. rotating a tablet, resizing devtools)
  // should close the overlay rather than leave it stuck open behind the
  // now-hidden mobile trigger, and keep the edge-tab's handler in sync.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1050px)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktopMenu(event.matches)
      if (event.matches) setMobileMenuOpen(false)
    }
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  const sheetData = useSheetDraft(search)
  const content = buildSheetContent(sheetData.settings)

  // WASM support doesn't change mid-session — checked once, synchronously.
  const [wasmSupported] = useState(() => supportsWasm())
  // PDF-viewer support needs an async probe (see pdf-support.ts) — optimistic
  // `true` default so the common case (a real working viewer) never flashes
  // the editor preview first; flips to false if the probe comes back
  // negative, at which point `pdfModeRequested` below drops out and the
  // editor preview takes over.
  const [pdfViewerSupported, setPdfViewerSupported] = useState(true)
  useEffect(() => {
    let cancelled = false
    void supportsPdfEmbed().then((supported) => {
      if (!cancelled) setPdfViewerSupported(supported)
    })
    return () => {
      cancelled = true
    }
  }, [])
  // `?editor=1` is a hidden dev flag (no UI affordance) forcing the old live
  // HTML preview; devices without real WASM support skip rendering
  // entirely — there's nothing to show or download either way. Rendering
  // itself, though, only depends on WASM: it still runs even when
  // `pdfViewerSupported` is false, since that PDF is exactly what the
  // download banner below offers on browsers that can't display it inline.
  const renderEnabled = search.editor !== 1 && wasmSupported
  const pdfModeRequested = renderEnabled && pdfViewerSupported
  const {
    url: pdfUrl,
    blob: pdfBlob,
    loading: pdfLoading,
    failed: pdfFailed,
  } = usePdfPreview(search, renderEnabled)
  // A Folio render failure (after committing to PDF mode) falls back to the
  // live editor-preview rather than leaving a blank/broken pane.
  const showEditor = !pdfModeRequested || pdfFailed
  // Only when the PDF itself is fine and this browser just can't display it
  // inline — a render failure means there's nothing to download either.
  const showPreviewUnavailableBanner = renderEnabled && !pdfViewerSupported && !pdfFailed

  return (
    <StepShell stepNumber={5} titleKey="wizard.steps.5.title" descriptionKey="wizard.steps.5.description">
     <div className="flex flex-1 min-h-0 flex-row" data-step="5">
        {menuOpen ? (
          <div className="hidden min-[1050px]:flex w-87.5 flex-col shrink-0 overflow-hidden border-e bg-card">
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <SheetSettingsPanel search={search} setSearch={setSearch} />
            </div>
            <div className="shrink-0 border-t p-3">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setMenuOpen(false)}>
                <PanelRightClose className="size-4" />
                {t('wizard.actions.hideSettings')}
              </Button>
            </div>
          </div>
        ) : null}
        {showEditor ? (
        <div className="relative grow min-w-0 overflow-hidden">
          <div className="h-full w-full overflow-y-auto bg-gray-200 p-6">
            <ScaleA4Preview>
              <SheetDocument content={content} layout={sheetData.layout} settings={sheetData.settings} />
            </ScaleA4Preview>
          </div>
          {showPreviewUnavailableBanner ? (
            <PdfPreviewUnavailableBanner blob={pdfBlob} filename={sheetFilename(search)} />
          ) : null}
        </div>
        ) : (
        <div className="relative grow min-w-0 bg-gray-200">
          {pdfUrl ? <PdfViewer url={pdfUrl} /> : null}
          {pdfLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-200/90 p-6 text-center print:hidden">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="font-semibold">שלא תדעו עוד צער</p>
              <p className="text-muted-foreground text-sm">
                {`מכינים לך את הדפים לסדר עלייה ל${deceasedWord(sheetData.settings.gender)}`}
              </p>
            </div>
          ) : null}
        </div>
        )}
        <style>{MENU_FAB_CSS}</style>
        <button
          type="button"
          aria-label={t('common.previous')}
          onClick={() => setSearch({ step: search.step - 1 })}
          className="fixed top-16 min-[1050px]:top-4 inset-s-4 z-40 flex size-9 items-center justify-center rounded-full border bg-background shadow-md print:hidden"
        >
          <ArrowLeft className="size-4 rtl:-scale-x-100" />
        </button>
        <button
          type="button"
          aria-label={isDesktopMenu ? t('wizard.actions.showSettings') : t('wizard.actions.settings')}
          onClick={() => (isDesktopMenu ? setMenuOpen(true) : setMobileMenuOpen(true))}
          className={cn(
            'izkor-menu-fab fixed top-1/2 -translate-y-1/2 z-40 flex items-center justify-center print:hidden',
            menuOpen ? 'min-[1050px]:hidden' : 'min-[1050px]:flex',
          )}
        >
          <Settings2 className="size-5" />
        </button>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="start">
            <SheetHeader>
              <SheetTitle>{t('wizard.actions.settings')}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto px-4 pb-4">
              <SheetSettingsPanel search={search} setSearch={setSearch} />
            </div>
          </SheetContent>
        </Sheet>
     </div>
    </StepShell>
  )
}
