import { createFileRoute } from '@tanstack/react-router'

import BlogIndexPage from '@/pages/BlogIndexPage'

export const Route = createFileRoute('/en/blog/')({
  component: BlogIndexPage,
})
