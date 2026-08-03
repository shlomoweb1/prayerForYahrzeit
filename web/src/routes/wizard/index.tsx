import { createFileRoute } from '@tanstack/react-router'

import { WizardQuery } from '@/features/wizard/wizard-query'
import WizardPage from '@/pages/wizard/WizardPage'

export const Route = createFileRoute('/wizard/')({
  validateSearch: WizardQuery,
  component: WizardPage,
})
