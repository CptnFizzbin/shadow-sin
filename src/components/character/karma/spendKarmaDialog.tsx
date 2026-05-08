import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"

import { SpendKarmaDialogProvider } from "./characterImprovements/forms/spendKarmaDialogContext.tsx"
import { SpendKarmaDialogContent } from "./spendKarmaDialogContent.tsx"

interface SpendKarmaDialogProps extends ControlledDialogProps<void> {
  onNewSpell?: () => void
}

const SpendKarmaDialog: FC<SpendKarmaDialogProps> = ({ ctrl, onNewSpell }) => (
  <SpendKarmaDialogProvider ctrl={ctrl} onNewSpell={onNewSpell}>
    <SpendKarmaDialogContent ctrl={ctrl} />
  </SpendKarmaDialogProvider>
)

interface UseSpendKarmaDialogProps {
  onNewSpell?: () => void
}

export const useSpendKarmaDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseSpendKarmaDialogProps) =>
      dialogApi.open<void>((ctrl) => (
        <SpendKarmaDialog ctrl={ctrl} onNewSpell={props?.onNewSpell} />
      )),
  }
}
