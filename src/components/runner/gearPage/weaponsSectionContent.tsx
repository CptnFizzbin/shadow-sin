import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isWeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { GearViewItem } from "./gearViewItem.tsx"

interface WeaponsSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
}

export const WeaponsSectionContent: FC<WeaponsSectionContentProps> = ({
  items,
  getChildren,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const weaponFormDialog = useWeaponFormDialog()
  const accessoryFormDialog = useItemFormDialog()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) saveItem(saved)
  }

  const handleEditAccessory = async (accessory: ItemData, parentId: UUID) => {
    const saved = await accessoryFormDialog.open({ item: accessory, label: "Weapon Accessory" })
    if (saved) saveItem({ ...saved, parentId })
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => (
        <GearViewItem
          key={item.id}
          item={item}
          subItems={getChildren(item.id)}
          onEdit={() => isWeaponData(item) && handleEditWeapon(item)}
          onRemove={() => dispatch(Actions.gear.removeItem({ id: item.id, removeChildren: true }))}
          getSubItemCallbacks={(subItemId) => {
            const accessory = getChildren(item.id).find((child) => child.id === subItemId)
            return {
              onEdit: accessory
                ? () => handleEditAccessory(accessory, item.id as UUID)
                : undefined,
              onRemove: accessory ? () => dispatch(Actions.gear.removeItem({ id: accessory.id })) : undefined,
            }
          }}
        />
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
