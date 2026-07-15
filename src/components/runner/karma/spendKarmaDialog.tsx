import { useDialog } from "#/components/ui/dialog/useDialog.tsx"

// PROTOTYPE — temporarily renders the mobile-layout prototypes instead of
// SpendKarmaDialogContent. Revert this file once a variant wins; see
// runnerImprovements/prototypes/NOTES.md.
import { SpendKarmaDialogPrototypes } from "./runnerImprovements/prototypes/spendKarmaDialogPrototypes.tsx"

export const useSpendKarmaDialog = () => useDialog<void>((ctrl) => <SpendKarmaDialogPrototypes ctrl={ctrl} />)
