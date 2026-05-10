import type { UUID } from "node:crypto"

import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isWeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { GearSectionContentScaffold } from "./gearSectionContentScaffold.tsx"

interface WeaponsSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
}

export const WeaponsSectionContent: FC<WeaponsSectionContentProps> = ({
  items,
  getChildren,
}) => {
  const gearStore = useGearStore()
  const weaponFormDialog = useWeaponFormDialog()
  const accessoryFormDialog = useItemFormDialog()

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) gearStore.save(saved)
  }

  const handleEditAccessory = async (accessory: ItemData, parentId: UUID) => {
    const saved = await accessoryFormDialog.open({ item: accessory, label: "Weapon Accessory" })
    if (saved) gearStore.save({ ...saved, parentId })
  }

  return (
    <GearSectionContentScaffold
      items={items}
      getSubItems={(item) => getChildren(item.id)}
      getItemCallbacks={(item) => ({
        onEdit: isWeaponData(item) ? () => handleEditWeapon(item) : undefined,
        onRemove: () => gearStore.remove(item, { removeChildren: true }),
        getSubItemCallbacks: (subItemId) => {
          const accessory = getChildren(item.id).find((child) => child.id === subItemId)
          return {
            onEdit: accessory
              ? () => handleEditAccessory(accessory, item.id as UUID)
              : undefined,
            onRemove: accessory ? () => gearStore.remove(accessory) : undefined,
          }
        },
      })}
      addAction={{ label: "Add Weapon", onClick: () => handleEditWeapon() }}
    />
  )
}
