import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"

import { SpendKarmaDialogContent } from "./spendKarmaDialogContent.tsx"

export const useSpendKarmaDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: () => dialogApi.open<void>((ctrl) => <SpendKarmaDialogContent ctrl={ctrl} />),
  }
}
