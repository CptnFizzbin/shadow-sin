import type { FC } from "react"

import { GearFormLicenseSection } from "#/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { itemDefaults, useItemForm } from "#/hooks/items/forms/useItemForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AnyDialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

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
