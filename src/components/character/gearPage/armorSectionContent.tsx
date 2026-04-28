import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { isArmorData } from "#/system/gear/armorData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { GearViewItem } from "./gearViewItem.tsx"

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
    const saved = await armorFormDialog.open({ armor }).result()
    if (saved) gearStore.save(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => (
        <GearViewItem
          key={item.id}
          item={item}
          subItems={getChildren(item.id)}
          onEdit={() => isArmorData(item) && handleEditArmor(item)}
          onRemove={() => gearStore.remove(item, { removeChildren: true })}
          getSubItemCallbacks={(subItemId) => {
            const subItem = getChildren(item.id).find((child) => child.id === subItemId)
            return {
              onEdit: subItem && isArmorData(subItem)
                ? () => handleEditArmor(subItem)
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
        onClick={() => handleEditArmor()}
        color="secondary"
        fullWidth
      >
        Add Armor
      </Button>
    </Stack>
  )
}
