import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { WeaponItemCard } from "#/components/items/types/weapons/weaponItemCard.tsx"
import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export const WeaponsList: FC = () => {
  const gearApi = useGearStore()
  const weapons = useGearByType<WeaponData>(ItemType.weapon)
  const weaponFormDialog = useWeaponFormDialog()
  const accessoryFormDialog = useItemFormDialog()

  const topLevelWeapons = weapons.filter((weapon) => !weapon.parentId)
  const getAccessories = (parentId: string) =>
    weapons.filter((weapon) => weapon.parentId === parentId)

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) gearApi.save(saved)
  }

  const handleAddAccessory = async (parentId: UUID) => {
    const saved = await accessoryFormDialog.open({ label: "Weapon Accessory" })
    if (saved) gearApi.save({ ...saved, parentId })
  }

  const handleEditAccessory = async (accessory: ItemData) => {
    const saved = await accessoryFormDialog.open({ item: accessory, label: "Weapon Accessory" })
    if (saved) gearApi.save(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {topLevelWeapons.map((weapon) => {
        const accessories = getAccessories(weapon.id)

        return (
          <WeaponItemCard
            key={weapon.id}
            weapon={weapon}
            accessories={accessories}
            onEdit={() => handleEditWeapon(weapon)}
            onRemove={() => gearApi.remove(weapon)}
            onAddAccessory={() => handleAddAccessory(weapon.id as UUID)}
            onEditAccessory={(accessory) => handleEditAccessory(accessory)}
            onRemoveAccessory={(accessory) => gearApi.remove(accessory)}
          />
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditWeapon()}
        color="secondary"
        fullWidth
      >
        Add Weapon
      </Button>

      {weaponFormDialog.dialog}
      {accessoryFormDialog.dialog}
    </Stack>
  )
}
