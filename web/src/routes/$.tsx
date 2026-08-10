import NotFoundPage from '@/pages/NotFoundPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: NotFoundPage,
})
