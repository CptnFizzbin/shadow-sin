import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { GenericItemCard } from "#/components/items/genericItemCard.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

interface ItemsListProps {
  items: ItemData[]
  itemLabel?: string
  itemType?: ItemType
}

export const ItemsList: FC<ItemsListProps> = ({ itemLabel = "Item", itemType, items }) => {
  const dispatch = useRunnerStoreDispatch()
  const itemFormDialog = useItemFormDialog()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const topLevelItems = items.filter((item) => !item.parentId)
  const getSubItems = (parentId: string) =>
    items.filter((item) => item.parentId === parentId)

  const handleAdd = async (parentId?: UUID) => {
    const label = parentId ? `${itemLabel} sub-item` : itemLabel
    const saved = await itemFormDialog.open({ itemType, label })
    if (saved) saveItem(parentId ? { ...saved, parentId } : saved)
  }

  const handleEdit = async (item: ItemData) => {
    const label = item.parentId ? `${itemLabel} sub-item` : itemLabel
    const saved = await itemFormDialog.open({ item, itemType, label })
    if (saved) saveItem(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {topLevelItems.map((item) => {
        const subItems = getSubItems(item.id)

        return (
          <GenericItemCard
            key={item.id}
            item={item}
            subItems={subItems}
            onEdit={() => handleEdit(item)}
            onRemove={() => dispatch(Actions.gear.removeItem({ id: item.id }))}
            onAddSubItem={() => handleAdd(item.id as UUID)}
            onEditSubItem={(subItem) => handleEdit(subItem)}
            onRemoveSubItem={(subItem) => dispatch(Actions.gear.removeItem({ id: subItem.id }))}
          />
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleAdd()}
        color="secondary"
        fullWidth
      >
        Add {itemLabel}
      </Button>

      {itemFormDialog.dialog}
    </Stack>
  )
}
