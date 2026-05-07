import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"

import { SpendKarmaDialogProvider } from "./characterImprovements/spendKarmaDialogContext.tsx"
import { SpendKarmaDialogContent } from "./spendKarmaDialogContent.tsx"

const SpendKarmaDialog: FC<ControlledDialogProps<void>> = ({ ctrl }) => (
  <SpendKarmaDialogProvider>
    <SpendKarmaDialogContent ctrl={ctrl} />
  </SpendKarmaDialogProvider>
)

export const useSpendKarmaDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: () => dialogApi.open<void>((ctrl) => <SpendKarmaDialog ctrl={ctrl} />),
  }
}
