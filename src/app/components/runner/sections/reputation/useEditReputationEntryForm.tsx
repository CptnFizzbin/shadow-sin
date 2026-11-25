import type { ReputationLedgerEntry } from "#data/reputation/reputationLedgerEntry.ts"
import { useDialog } from "#ui/dialog/useDialog.tsx"

import { ReputationEntryForm } from "./reputationEntryForm.tsx"

export const useEditReputationEntryForm = () => useDialog<void, { entry: ReputationLedgerEntry }>(
  (ctrl, props) => <ReputationEntryForm ctrl={ctrl} mode="edit" entry={props.entry} />,
)
