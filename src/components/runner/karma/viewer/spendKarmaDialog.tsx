import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

import { SpendKarmaDialogContent } from "./spendKarmaDialogContent.tsx"

export const useSpendKarmaDialog = () => useDialog<void>((ctrl) => <SpendKarmaDialogContent ctrl={ctrl} />)
