import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { initI18n } from '@/features/i18n'
import { ThemeProvider } from '@/features/theme'
import './css/index.css'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!

// scripts/prerender.mjs bakes route-specific title/meta/link/JSON-LD tags
// into the static HTML for crawlers. This app renders with createRoot (no
// hydrateRoot - there is no real SSR here), so React has no way to recognize
// those static tags as "its own" once RouteHead portals in the live,
// route-managed set - left alone, the two would coexist, duplicating title/
// canonical/OG/JSON-LD in the DOM for the lifetime of the page view. Static
// index.html has none of these tags itself (see its own comment), so on a
// non-prerendered load this is a safe no-op; it only ever removes prerendered
// artifacts before the live TanStack Router head takes over.
function clearPrerenderedHead(): void {
  const selector = [
    'title',
    'meta[name="description"]',
    'meta[property^="og:"]',
    'meta[name="robots"]',
    'link[rel="canonical"]',
    'link[rel="alternate"][hreflang]',
    'script[type="application/ld+json"]',
  ].join(', ')
  document.head.querySelectorAll(selector).forEach((el) => el.remove())
}

clearPrerenderedHead()

void initI18n().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
})
