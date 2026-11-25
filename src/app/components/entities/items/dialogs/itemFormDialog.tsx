import type { FC } from "react"

import { GearFormLicenseSection } from "#app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import type { ItemData } from "#data/items/itemData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { itemDefaults, useItemForm } from "#forms/items/useItemForm.tsx"
import type { AnyDialogCtrl } from "#ui/dialog/dialogCtrl.ts"
import { useDialog } from "#ui/dialog/useDialog.tsx"

import { ItemDialog } from "./itemDialog.tsx"

interface ItemFormDialogProps {
  ctrl: AnyDialogCtrl
  item?: ItemData
  itemType?: ItemType
  label?: string
  wizard?: boolean
  parentId?: UUID
}

export const ItemFormDialog: FC<ItemFormDialogProps> = ({
  ctrl,
  item,
  itemType,
  label = "Item",
  wizard,
  parentId,
}) => {
  const title = item ? `Edit ${label}` : `Add ${label}`

  const form = useItemForm({
    item,
    defaultValues: {
      ...itemDefaults,
      itemType: itemType ?? ItemType.other,
      rating: 1,
      items: parentId ? { ...itemDefaults.items, parentId } : itemDefaults.items,
    },
    onSubmit: (itemData) => ctrl.close(itemData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      wizard={wizard}
      options={{
        hasRating: { enabled: true },
        multiple: { enabled: true },
        isSubItem: parentId ? { forced: true } : undefined,
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
