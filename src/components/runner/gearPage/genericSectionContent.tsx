import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

import { GearViewItem } from "./gearViewItem.tsx"

interface GenericSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
  itemLabel: string
  itemType?: ItemType
}

export const GenericSectionContent: FC<GenericSectionContentProps> = ({
  items,
  getChildren,
  itemLabel,
  itemType,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const itemFormDialog = useItemFormDialog()

  const handleEdit = async (item?: ItemData) => {
    const saved = await itemFormDialog.open({ item, itemType, label: itemLabel })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => (
        <GearViewItem
          key={item.id}
          item={item}
          subItems={getChildren(item.id)}
          onEdit={() => handleEdit(item)}
          onRemove={() => dispatch(Actions.gear.removeItem({ id: item.id, removeChildren: true }))}
          getSubItemCallbacks={(subItemId) => {
            const subItem = getChildren(item.id).find((child) => child.id === subItemId)
            return {
              onEdit: subItem ? () => handleEdit(subItem) : undefined,
              onRemove: subItem ? () => dispatch(Actions.gear.removeItem({ id: subItem.id })) : undefined,
            }
          }}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEdit()}
        color="secondary"
        fullWidth
      >
        Add {itemLabel}
      </Button>

      {itemFormDialog.dialog}
    </Stack>
  )
}
