import type { FC } from "react"

import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { useSinForm } from "#/components/items/types/licenses/forms/useSinForm.tsx"
import { getSinCost } from "#/components/items/types/licenses/sinUtils.ts"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (sin: SinData) => void
  onDelete?: () => void
  sin?: SinData
}

export const SinFormDialog: FC<SinFormDialogProps> = ({
  open,
  sin,
  onClose,
  onClosed,
  onSave,
  onDelete,
}) => {
  const title = sin ? "Edit SIN" : "Create SIN"

  const form = useSinForm({
    sin,
    onSubmit: onSave,
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      onDelete={onDelete}
      getCost={(s) => getSinCost(Number(s.rating))}
      ratingMax={6}
      options={{ hasRating: { forced: true } }}
    />
  )
}

export type UseSinFormDialogProps = Omit<SinFormDialogProps, "open" | "onClose" | "onClosed" | "onSave">

export const useSinFormDialog = () => {
  const dialogApi = useDialogApi()
  const sheetContext = useCharacterSheetContext()

  return {
    open: (props?: UseSinFormDialogProps) => dialogApi.open<SinData>(
      (dialogProps) => (
        <CharacterSheetProvider store={sheetContext}>
          <SinFormDialog
            {...dialogProps}
            {...props}
            onSave={(sin) => dialogProps.onClose(sin)}
          />
        </CharacterSheetProvider>
      ),
    ),
  }
}
