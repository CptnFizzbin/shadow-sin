import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { ArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { isArmorData } from "#/system/gear/armorData.ts"
import type { ItemData } from "#/system/itemData.ts"

type ArmorDialogState = null | { open: boolean, armor?: ArmorData }

interface ArmorSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
}

export const ArmorSectionContent: FC<ArmorSectionContentProps> = ({
  items,
  getChildren,
}) => {
  const gearStore = useGearStore()
  const [dialogState, setDialogState] = useState<ArmorDialogState>(null)

  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })

  const handleSave = (armor: ArmorData) => {
    gearStore.save(armor)
    closeDialog()
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => (
        <GearViewItem
          key={item.id}
          item={item}
          subItems={getChildren(item.id)}
          onEdit={() => isArmorData(item) && setDialogState({ open: true, armor: item })}
          onRemove={() => gearStore.remove(item, { removeChildren: true })}
          getSubItemCallbacks={(subItemId) => {
            const subItem = getChildren(item.id).find((child) => child.id === subItemId)
            return {
              onEdit: subItem
                ? () => setDialogState(isArmorData(subItem)
                    ? {
                        open: true,
                        armor: subItem,
                      }
                    : null)
                : undefined,
              onRemove: subItem ? () => gearStore.remove(subItem) : undefined,
            }
          }}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true })}
        color="secondary"
        fullWidth
      >
        Add Armor
      </Button>

      {dialogState && (
        <ArmorFormDialog
          open={dialogState.open}
          armor={dialogState.armor}
          onSave={handleSave}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
