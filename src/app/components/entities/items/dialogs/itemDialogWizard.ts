import { createWorkflow, useWorkflow } from "#/components/ui/workflow/createWorkflow.tsx"

export enum ItemDialogWizardStep {
  Stats = "Stats",
  Effects = "Effects",
  Finalize = "Finalize",
}

/**
 * Drives `ItemDialog`'s `wizard` mode (Enter Stats / Select Effects / Finalize) — the
 * per-type field data itself stays in the TanStack form `ItemDialog` already receives, so this
 * workflow carries no data of its own, only step navigation. `ItemDialog` always renders under
 * this workflow's `Provider` (see `itemDialog.tsx`); non-wizard callers just never read from it.
 */
export const ItemDialogWizard = createWorkflow<object, ItemDialogWizardStep>()

export const useItemDialogWizard = () => useWorkflow(ItemDialogWizard)
