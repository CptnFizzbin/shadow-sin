import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { GearItemFormDialog } from "#/components/gear/dialogs/gearItemFormDialog.tsx"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import { WeaponFormDialog } from "#/components/gear/weapons/dialogs/weaponFormDialog.tsx"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

type WeaponDialogState =
  | null
  | { open: boolean }
  | { open: boolean, parentId: UUID }

interface WeaponsSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
}

export const WeaponsSectionContent: FC<WeaponsSectionContentProps> = ({
  items,
  getChildren,
}) => {
  const gearStore = useGearStore()
  const [dialogState, setDialogState] = useState<WeaponDialogState>(null)

  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })
  const isAccessoryMode = dialogState !== null && "parentId" in dialogState

  const handleSaveWeapon = (weapon: WeaponData) => {
    gearStore.save(weapon)
    closeDialog()
  }

  const handleSaveAccessory = (accessoryItem: ItemData) => {
    const parentId = dialogState !== null && "parentId" in dialogState
      ? dialogState.parentId
      : undefined
    gearStore.save(parentId ? { ...accessoryItem, parentId } : accessoryItem)
    closeDialog()
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => (
        <GearViewItem key={item.id} item={item} subItems={getChildren(item.id)} />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true })}
        color="secondary"
        fullWidth
      >
        Add Weapon
      </Button>

      {dialogState && !isAccessoryMode && (
        <WeaponFormDialog
          open={dialogState.open}
          onSave={handleSaveWeapon}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}

      {dialogState && isAccessoryMode && (
        <GearItemFormDialog
          open={dialogState.open}
          label="Weapon Accessory"
          onSave={handleSaveAccessory}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
