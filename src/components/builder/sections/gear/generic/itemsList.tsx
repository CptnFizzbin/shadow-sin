import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { ItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { GenericItemCard } from "#/components/items/genericItemCard.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

type DialogState =
  | null
  | { mode: "create", parentId?: UUID, open: boolean }
  | { mode: "edit", item: ItemData, open: boolean }

interface ItemsListProps {
  items: ItemData[]
  itemLabel?: string
  itemType?: ItemType
}

export const ItemsList: FC<ItemsListProps> = ({ itemLabel = "Item", itemType, items }) => {
  const gearApi = useGearStore()
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const topLevelItems = items.filter((item) => !item.parentId)
  const getSubItems = (parentId: string) =>
    items.filter((item) => item.parentId === parentId)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAdd = (item: ItemData) => {
    const parentId = dialogState?.mode === "create" ? dialogState.parentId : undefined

    if (parentId)
      gearApi.save({ ...item, parentId })
    else
      gearApi.save(item)

    onDialogClose()
  }

  const handleUpdate = (item: ItemData) => {
    gearApi.save(item)
    onDialogClose()
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
            onEdit={() => setDialogState({ mode: "edit", item, open: true })}
            onRemove={() => gearApi.remove(item)}
            onAddSubItem={() =>
              setDialogState({ mode: "create", parentId: item.id, open: true })}
            onEditSubItem={(subItem) =>
              setDialogState({ mode: "edit", item: subItem, open: true })}
            onRemoveSubItem={(subItem) => gearApi.remove(subItem)}
          />
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add {itemLabel}
      </Button>

      {dialogState?.mode === "create" && (
        <ItemFormDialog
          open={dialogState.open}
          itemType={itemType}
          label={dialogState.parentId ? `${itemLabel} sub-item` : itemLabel}
          onSave={handleAdd}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <ItemFormDialog
          open={dialogState.open}
          itemType={itemType}
          item={dialogState.item}
          label={dialogState.item.parentId ? `${itemLabel} sub-item` : itemLabel}
          onSave={handleUpdate}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </Stack>
  )
}
