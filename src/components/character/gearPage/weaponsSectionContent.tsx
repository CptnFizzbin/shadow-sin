import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { GearItemFormDialog } from "#/components/characterBuilder/sections/gear/generic/dialogs/gearItemFormDialog.tsx"
import { WeaponFormDialog } from "#/components/characterBuilder/sections/gear/weapons/dialogs/weaponFormDialog.tsx"
import { useGearPurchase } from "#/components/gear/useGearPurchase.ts"
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
  const { acquire, purchase } = useGearPurchase()
  const [dialogState, setDialogState] = useState<WeaponDialogState>(null)

  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })
  const isAccessoryMode = dialogState !== null && "parentId" in dialogState

  return (
    <Stack gap={1}>
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
          onAcquire={(weapon: WeaponData) => acquire(weapon, closeDialog)}
          onPurchase={(weapon: WeaponData) => purchase(weapon, weapon.cost ?? 0, closeDialog)}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}

      {dialogState && isAccessoryMode && (
        <GearItemFormDialog
          open={dialogState.open}
          label="Weapon Accessory"
          onAcquire={(accessoryItem: ItemData) => {
            const parentId = "parentId" in dialogState ? dialogState.parentId : undefined
            acquire(parentId ? { ...accessoryItem, parentId } : accessoryItem, closeDialog)
          }}
          onPurchase={(accessoryItem: ItemData) => {
            const parentId = "parentId" in dialogState ? dialogState.parentId : undefined
            purchase(
              parentId ? { ...accessoryItem, parentId } : accessoryItem,
              accessoryItem.cost ?? 0,
              closeDialog,
            )
          }}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
