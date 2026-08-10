import { createFileRoute } from '@tanstack/react-router'

import FolioPage from '@/pages/FolioPage'

export const Route = createFileRoute('/tools/folio')({
  component: FolioPage,
})
