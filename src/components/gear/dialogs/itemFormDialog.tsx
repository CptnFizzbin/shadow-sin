import type { FC } from "react"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import { itemDefaults, useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

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
