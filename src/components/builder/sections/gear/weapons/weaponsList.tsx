import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { WeaponDataCard } from "#/components/items/types/weapons/weaponDataCard.tsx"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
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

  const topLevelWeapons = weapons.filter((weapon) => !weapon.parentId)

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) saveItem(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {topLevelWeapons.map((weapon) => (
        <WeaponDataCard key={weapon.id} weapon={weapon} onOpen={() => handleEditWeapon(weapon)} />
      ))}

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
