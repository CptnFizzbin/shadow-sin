import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { ReputationLedgerEntry } from "#/system/reputation/reputationLedgerEntry.ts"

import { ReputationEntryForm } from "./reputationEntryForm.tsx"

export const useEditReputationEntryForm = () => useDialog<void, { entry: ReputationLedgerEntry }>(
  (ctrl, props) => <ReputationEntryForm ctrl={ctrl} mode="edit" entry={props.entry} />,
)
