import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useGearByType } from "#/components/items/gearHooks.ts"
import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { WeaponItemCard } from "#/components/items/types/weapons/weaponItemCard.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export const WeaponsList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const weapons = useGearByType<WeaponData>(ItemType.weapon)
  const weaponFormDialog = useWeaponFormDialog()
  const accessoryFormDialog = useItemFormDialog()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))
  const removeItem = (item: ItemData) => dispatch(Actions.gear.removeItem({ id: item.id }))

  const topLevelWeapons = weapons.filter((weapon) => !weapon.parentId)
  const getAccessories = (parentId: string) =>
    weapons.filter((weapon) => weapon.parentId === parentId)

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) saveItem(saved)
  }

  const handleAddAccessory = async (parentId: UUID) => {
    const saved = await accessoryFormDialog.open({ label: "Weapon Accessory" })
    if (saved) saveItem({ ...saved, parentId })
  }

  const handleEditAccessory = async (accessory: ItemData) => {
    const saved = await accessoryFormDialog.open({ item: accessory, label: "Weapon Accessory" })
    if (saved) saveItem(saved)
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
            onRemove={() => removeItem(weapon)}
            onAddAccessory={() => handleAddAccessory(weapon.id as UUID)}
            onEditAccessory={(accessory) => handleEditAccessory(accessory)}
            onRemoveAccessory={(accessory) => removeItem(accessory)}
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
