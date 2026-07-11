import type { FC } from "react"

import { itemDefaults, useItemForm } from "#/components/items/forms/useItemForm.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { ItemDialog } from "./itemDialog.tsx"

interface ItemFormDialogProps {
  ctrl: AnyDialogCtrl
  item?: ItemData
  itemType?: ItemType
  label?: string
}

export const ItemFormDialog: FC<ItemFormDialogProps> = ({
  ctrl,
  item,
  itemType,
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
    onSubmit: (itemData) => ctrl.close(itemData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      options={{
        hasRating: { enabled: true },
        multiple: { enabled: true },
      }}
    />
  )
}

type UseItemFormDialogProps = Omit<ItemFormDialogProps, "ctrl">

export const useItemFormDialog = () => useDialog<ItemData, UseItemFormDialogProps | undefined>(
  (ctrl, props) => <ItemFormDialog ctrl={ctrl} {...props} />,
)
