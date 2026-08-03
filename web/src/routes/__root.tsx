import { createRootRoute } from '@tanstack/react-router'

import WrapperComponent from '@/components/common/Wrapper'
import { NotFoundComponent } from '@/pages/NotFoundPage'




export const Route = createRootRoute({
  component: WrapperComponent,
  notFoundComponent: NotFoundComponent,
})


