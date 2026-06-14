import { useDialogApi } from "#/components/ui/dialog/api/dialogApiProvider.tsx"

import { SpendKarmaDialogContent } from "./spendKarmaDialogContent.tsx"

export const useSpendKarmaDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: () => dialogApi.open<void>((ctrl) => <SpendKarmaDialogContent ctrl={ctrl} />),
  }
}
