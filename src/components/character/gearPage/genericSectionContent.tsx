import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

import { GearSectionContentScaffold } from "./gearSectionContentScaffold.tsx"

interface GenericSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
  itemLabel: string
  itemType?: ItemType
}

export const GenericSectionContent: FC<GenericSectionContentProps> = ({
  items,
  getChildren,
  itemLabel,
  itemType,
}) => {
  const gearStore = useGearStore()
  const itemFormDialog = useItemFormDialog()

  const handleEdit = async (item?: ItemData) => {
    const saved = await itemFormDialog.open({ item, itemType, label: itemLabel })
    if (saved) gearStore.save(saved)
  }

  return (
    <GearSectionContentScaffold
      items={items}
      getSubItems={(item) => getChildren(item.id)}
      getItemCallbacks={(item) => ({
        onEdit: () => handleEdit(item),
        onRemove: () => gearStore.remove(item, { removeChildren: true }),
        getSubItemCallbacks: (subItemId) => {
          const subItem = getChildren(item.id).find((child) => child.id === subItemId)
          return {
            onEdit: subItem ? () => handleEdit(subItem) : undefined,
            onRemove: subItem ? () => gearStore.remove(subItem) : undefined,
          }
        },
      })}
      addAction={{ label: `Add ${itemLabel}`, onClick: () => handleEdit() }}
    />
  )
}
