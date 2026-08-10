import { createRootRoute } from '@tanstack/react-router'

import WrapperComponent from '@/components/common/Wrapper'
import { siteDefaults } from '@/features/seo/siteDefaults'
import { NotFoundComponent } from '@/pages/NotFoundPage'

export const Route = createRootRoute({
  head: siteDefaults,
  component: WrapperComponent,
  notFoundComponent: NotFoundComponent,
})


