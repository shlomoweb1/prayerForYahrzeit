import { createFileRoute } from '@tanstack/react-router'

import { folioClient } from '@/features/folio/folio-client'
import { supportsWasm } from '@/features/folio/wasm-support'
import { WizardQuery } from '@/features/wizard/wizard-query'
import WizardPage from '@/pages/wizard/WizardPage'

export const Route = createFileRoute('/wizard/')({
  validateSearch: WizardQuery,
  // Fire-and-forget warm-up: the ~16MB Folio WASM module starts loading the
  // moment someone hits /wizard (step 1), not step 5 where it's first
  // needed, so it's very likely already warm by the time they get there.
  // Deliberately NOT returned/awaited — returning a promise from
  // `beforeLoad` makes the router suspend navigation until it resolves,
  // which would block steps 1-4 behind a 16MB download. `folioClient.warm()`
  // memoizes internally, so repeated navigations to /wizard are cheap after
  // the first. Skipped entirely on devices with no real WASM support — the
  // PDF pipeline will never be used there anyway (step 5 falls back to the
  // live editor-preview).
  beforeLoad: () => {
    if (supportsWasm()) {
      folioClient.warm().catch(() => {
        // Non-fatal: renderPdf()/folioClient.render() on step 5 re-attempts
        // regardless of whether the warm-up succeeded — a failed warm just
        // means the first real render won't have had a head start.
      })
    }
  },
  component: WizardPage,
})
