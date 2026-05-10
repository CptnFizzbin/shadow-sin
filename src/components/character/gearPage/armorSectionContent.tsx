import type { FC } from "react"

import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { isArmorData } from "#/system/gear/armorData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { GearSectionContentScaffold } from "./gearSectionContentScaffold.tsx"

interface ArmorSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
}

export const ArmorSectionContent: FC<ArmorSectionContentProps> = ({
  items,
  getChildren,
}) => {
  const gearStore = useGearStore()
  const armorFormDialog = useArmorFormDialog()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) gearStore.save(saved)
  }

  return (
    <GearSectionContentScaffold
      items={items}
      getSubItems={(item) => getChildren(item.id)}
      getItemCallbacks={(item) => ({
        onEdit: isArmorData(item) ? () => handleEditArmor(item) : undefined,
        onRemove: () => gearStore.remove(item, { removeChildren: true }),
        getSubItemCallbacks: (subItemId) => {
          const subItem = getChildren(item.id).find((child) => child.id === subItemId)
          return {
            onEdit: subItem && isArmorData(subItem)
              ? () => handleEditArmor(subItem)
              : undefined,
            onRemove: subItem ? () => gearStore.remove(subItem) : undefined,
          }
        },
      })}
      addAction={{ label: "Add Armor", onClick: () => handleEditArmor() }}
    />
  )
}
