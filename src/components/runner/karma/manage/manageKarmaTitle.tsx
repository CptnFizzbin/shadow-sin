import type { FC } from "react"

import { useSpendKarmaDialogContext } from "#/components/runner/karma/spendKarmaDialogContext.tsx"
import { useVisibleSections } from "#/hooks/improvements/useVisibleSections.ts"

import { ManageKarmaStepHeader } from "./manageKarmaStepHeader.tsx"
import { ManageKarmaStep, ManageKarmaStepLabels, useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"

/**
 * The Manage Karma dialog's title: "Manage Karma" on the menu, otherwise the current step's name
 * with a back arrow — to the Spend Karma categories from inside one, or else to the menu.
 * Must render under `ManageKarmaWorkflow.Provider` and `SpendKarmaDialogProvider`.
 */
export const ManageKarmaTitle: FC = () => {
  const workflow = useManageKarmaWorkflow()
  const { improvementStore } = useSpendKarmaDialogContext()
  const visibleSections = useVisibleSections()

  if (workflow.currentStep === ManageKarmaStep.Menu) return ManageKarmaStepLabels[ManageKarmaStep.Menu]

  const spendSection = visibleSections.find((section) => section.key === workflow.data.spendSection)
  if (workflow.currentStep === ManageKarmaStep.Spend && spendSection) {
    return (
      <ManageKarmaStepHeader
        title={spendSection.label}
        backLabel="Back to categories"
        onBack={() => workflow.setData((data) => {
          data.spendSection = null
        })}
      />
    )
  }

  const handleBack = () => {
    // Leaving Spend Karma abandons its queue, so re-entering it starts from nothing queued.
    improvementStore.removeAll()
    workflow.back()
  }

  return <ManageKarmaStepHeader title={ManageKarmaStepLabels[workflow.currentStep]} onBack={handleBack} />
}
