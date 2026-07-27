import type { FC } from "react"

import { GearFormLicenseSection } from "#/components/items/types/licenses/gearFormLicenseSection.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { itemDefaults, useItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
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
      slots={{
        itemFields: () => <GearFormLicenseSection form={form} />,
      }}
    />
  )
}

type UseItemFormDialogProps = Omit<ItemFormDialogProps, "ctrl">

export const useItemFormDialog = () => useDialog<ItemData, UseItemFormDialogProps | undefined>(
  (ctrl, props) => <ItemFormDialog ctrl={ctrl} {...props} />,
)
