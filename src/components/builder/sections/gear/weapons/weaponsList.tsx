import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { ItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { ItemCard } from "#/components/items/itemCard.tsx"
import { WeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

type WeaponDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", weapon: WeaponData, open: boolean }

type AccessoryDialogState =
  | null
  | { mode: "create", parentId: UUID, open: boolean }
  | { mode: "edit", item: ItemData, open: boolean }

export const WeaponsList: FC = () => {
  const gearApi = useGearStore()
  const weapons = useGearByType<WeaponData>(ItemType.weapon)
  const [weaponDialog, setWeaponDialog] = useState<WeaponDialogState>(null)
  const [accessoryDialog, setAccessoryDialog] = useState<AccessoryDialogState>(null)

  const topLevelWeapons = weapons.filter((weapon) => !weapon.parentId)
  const getAccessories = (parentId: string) =>
    weapons.filter((weapon) => weapon.parentId === parentId)

  const closeWeaponDialog = () =>
    setWeaponDialog((prev) => prev && { ...prev, open: false })

  const closeAccessoryDialog = () =>
    setAccessoryDialog((prev) => prev && { ...prev, open: false })

  const handleAddWeapon = (weapon: WeaponData) => {
    gearApi.save(weapon)
    closeWeaponDialog()
  }

  const handleUpdateWeapon = (weapon: WeaponData) => {
    gearApi.save(weapon)
    closeWeaponDialog()
  }

  const handleAddAccessory = (item: ItemData) => {
    if (accessoryDialog?.mode !== "create") return
    gearApi.save({ ...item, parentId: accessoryDialog.parentId })
    closeAccessoryDialog()
  }

  const handleUpdateAccessory = (item: ItemData) => {
    gearApi.save(item)
    closeAccessoryDialog()
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {topLevelWeapons.map((weapon) => {
        const accessories = getAccessories(weapon.id)

        return (
          <Box key={weapon.id}>
            <ItemCard
              item={weapon}
              onEdit={() => setWeaponDialog({ mode: "edit", weapon, open: true })}
              onRemove={() => gearApi.remove(weapon)}
            />

            <Stack
              sx={{
                gap: 1, paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: accessories.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: accessories.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {accessories.map((accessory) => (
                <ItemCard
                  key={accessory.id}
                  item={accessory}
                  onEdit={() =>
                    setAccessoryDialog({ mode: "edit", item: accessory, open: true })}
                  onRemove={() => gearApi.remove(accessory)}
                />
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={12} />}
                onClick={() =>
                  setAccessoryDialog({
                    mode: "create",
                    parentId: weapon.id,
                    open: true,
                  })}
                color="secondary"
                fullWidth
              >
                Add Accessory
              </Button>
            </Stack>
          </Box>
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setWeaponDialog({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add Weapon
      </Button>

      {weaponDialog?.mode === "create" && (
        <WeaponFormDialog
          open={weaponDialog.open}
          onSave={handleAddWeapon}
          onClose={closeWeaponDialog}
          onClosed={() => setWeaponDialog(null)}
        />
      )}

      {weaponDialog?.mode === "edit" && (
        <WeaponFormDialog
          open={weaponDialog.open}
          weapon={weaponDialog.weapon}
          onSave={handleUpdateWeapon}
          onClose={closeWeaponDialog}
          onClosed={() => setWeaponDialog(null)}
        />
      )}

      {accessoryDialog?.mode === "create" && (
        <ItemFormDialog
          open={accessoryDialog.open}
          label="Weapon Accessory"
          onSave={handleAddAccessory}
          onClose={closeAccessoryDialog}
          onClosed={() => setAccessoryDialog(null)}
        />
      )}

      {accessoryDialog?.mode === "edit" && (
        <ItemFormDialog
          open={accessoryDialog.open}
          item={accessoryDialog.item}
          label="Weapon Accessory"
          onSave={handleUpdateAccessory}
          onClose={closeAccessoryDialog}
          onClosed={() => setAccessoryDialog(null)}
        />
      )}
    </Stack>
  )
}
