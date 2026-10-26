import type { SpendKarmaSectionKey } from "#/components/runner/karma/improvements/spendKarmaSections.tsx"
import { createWorkflow, useWorkflow } from "#/components/ui/workflow/createWorkflow.tsx"

export enum ManageKarmaStep {
  Menu = "Menu",
  Earn = "Earn",
  Buy = "Buy",
  Spend = "Spend",
  Sell = "Sell",
  Edit = "Edit",
}

export const ManageKarmaStepLabels: Record<ManageKarmaStep, string> = {
  [ManageKarmaStep.Menu]: "Manage Karma",
  [ManageKarmaStep.Earn]: "Earn Karma",
  [ManageKarmaStep.Buy]: "Buy Karma",
  [ManageKarmaStep.Spend]: "Spend Karma",
  [ManageKarmaStep.Sell]: "Sell Karma",
  [ManageKarmaStep.Edit]: "Edit Karma",
}

export interface ManageKarmaWorkflowData {
  /** Karma to earn, buy, or sell. */
  amount: number
  /** Edit Karma's new current karma. */
  current: number
  /** Edit Karma's new total earned karma. */
  total: number
  /** Edit Karma's optional reason, recorded on the ledger entry. */
  reason: string
  /** The Spend Karma category drilled into, or `null` on its category list. */
  spendSection: SpendKarmaSectionKey | null
}

export const ManageKarmaWorkflow = createWorkflow<ManageKarmaWorkflowData, ManageKarmaStep>()

export const useManageKarmaWorkflow = () => useWorkflow(ManageKarmaWorkflow)

/** Fresh workflow data for a Runner with the given karma, as each step expects to start from. */
export const createManageKarmaData = (karma: { current: number, total: number }): ManageKarmaWorkflowData => ({
  amount: 1,
  current: karma.current,
  total: karma.total,
  reason: "",
  spendSection: null,
})
