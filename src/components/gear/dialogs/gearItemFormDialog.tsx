import type { FC } from "react"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import { useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

interface GearItemFormDialogProps {
  open: boolean
  item?: ItemData
  itemType?: ItemType
  onClose: () => void
  onClosed?: () => void
  onSave: (item: ItemData) => void
  label?: string
}

export const GearItemFormDialog: FC<GearItemFormDialogProps> = ({
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
    itemType,
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
        hasEffects: { enabled: true },
      }}
    />
  )
}
