import { useSheetDraft } from '@/features/sheet/from-query'
import { ScaleA4Preview } from '@/features/sheet/ScaleA4Preview'
import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

import "@/css/preview.css"

export function Step5Review({ search }: StepProps) {
  const {  layout } = useSheetDraft(search)

  return (
    <StepShell stepNumber={5} titleKey="wizard.steps.5.title" descriptionKey="wizard.steps.5.description">
     <div className="flex flex-1 flex-row" data-step="5">
        <div className="w-87.5">a</div>
        <div className="grow bg-gray-200 overflow-y-auto p-6">
          <ScaleA4Preview>
            <div data-page={layout.paper}>1</div>
            <div data-page={layout.paper}>2</div>
            <div data-page={layout.paper}>3</div>
          </ScaleA4Preview>
        </div>
     </div>
    </StepShell>
  )
}
