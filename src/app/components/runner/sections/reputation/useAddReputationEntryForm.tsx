import { useDialog } from "#forms/dialog/useDialog.tsx"

import { ReputationEntryForm } from "./reputationEntryForm.tsx"

export const useAddReputationEntryForm = () => useDialog<void>((ctrl) => <ReputationEntryForm ctrl={ctrl} mode="create" />)
