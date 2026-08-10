import { createFileRoute } from '@tanstack/react-router'

import ToolingPage from '@/pages/ToolingPage'

export const Route = createFileRoute('/tools/system')({
  component: ToolingPage,
})
