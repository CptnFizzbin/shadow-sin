import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
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
  const dispatch = useRunnerStoreDispatch()
  const armorFormDialog = useArmorFormDialog()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => (
        <GearViewItem
          key={item.id}
          item={item}
          subItems={getChildren(item.id)}
          onEdit={() => isArmorData(item) && handleEditArmor(item)}
          onRemove={() => dispatch(Actions.gear.removeItem({ id: item.id, removeChildren: true }))}
          getSubItemCallbacks={(subItemId) => {
            const subItem = getChildren(item.id).find((child) => child.id === subItemId)
            return {
              onEdit: subItem && isArmorData(subItem)
                ? () => handleEditArmor(subItem)
                : undefined,
              onRemove: subItem ? () => dispatch(Actions.gear.removeItem({ id: subItem.id })) : undefined,
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

      {armorFormDialog.dialog}
    </Stack>
  )
}
