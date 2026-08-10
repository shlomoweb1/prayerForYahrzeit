import { createFileRoute } from '@tanstack/react-router'

import BlogIndexPage from '@/pages/BlogIndexPage'

export const Route = createFileRoute('/blog/')({
  component: BlogIndexPage,
})
