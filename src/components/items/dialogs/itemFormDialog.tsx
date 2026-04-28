import type { FC } from "react"

import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { itemDefaults, useItemForm } from "#/components/items/forms/useItemForm.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { ItemDialog } from "./itemDialog.tsx"

interface ItemFormDialogProps {
  open: boolean
  item?: ItemData
  itemType?: ItemType
  onClose: () => void
  onClosed?: () => void
  onSave: (item: ItemData) => void
  label?: string
}

export const ItemFormDialog: FC<ItemFormDialogProps> = ({
  open,
  item,
  itemType,
  onClose,
  onClosed,
  onSave,
  label = "Item",
}) => {
  const title = item ? `Edit ${label}` : `Add ${label}`

  const form = useItemForm({
    item,
    defaultValues: {
      ...itemDefaults,
      itemType: itemType ?? ItemType.other,
      rating: 1,
    },
    onSubmit: onSave,
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      options={{
        hasRating: { enabled: true },
        multiple: { enabled: true },
      }}
    />
  )
}

export type UseItemFormDialogProps = Omit<ItemFormDialogProps, "open" | "onClose" | "onClosed" | "onSave">

export const useItemFormDialog = () => {
  const dialogApi = useDialogApi()
  const sheetContext = useCharacterSheetContext()

  return {
    open: (props?: UseItemFormDialogProps) => dialogApi.open<ItemData>(
      (dialogProps) => (
        <CharacterSheetProvider store={sheetContext}>
          <ItemFormDialog
            {...dialogProps}
            {...props}
            onSave={(item) => dialogProps.onClose(item)}
          />
        </CharacterSheetProvider>
      ),
    ),
  }
}
