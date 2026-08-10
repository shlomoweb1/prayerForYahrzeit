import { createPortal } from 'react-dom'
import { HeadContent } from '@tanstack/react-router'

/**
 * Renders TanStack Router's route-managed head tags (title, meta, links,
 * JSON-LD) into `document.head`. Portal'ing (rather than rendering in the
 * body) guarantees the tags land where browsers, social scrapers and the
 * Playwright prerender all look for them.
 */
export function RouteHead() {
  const head = document.querySelector('head')
  if (!head) return null
  return createPortal(<HeadContent />, head)
}
