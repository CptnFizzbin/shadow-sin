import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { ItemFormDialog } from "#/components/gear/dialogs/itemFormDialog.tsx"
import { ItemCard } from "#/components/gear/itemCard.tsx"
import { useGearStore } from "#/components/gear/useGearStore.ts"
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
          <Box key={item.id}>
            <ItemCard
              item={item}
              onEdit={() => setDialogState({ mode: "edit", item, open: true })}
              onRemove={() => gearApi.remove(item)}
            />

            <Stack
              sx={{
                gap: 1, paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: subItems.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: subItems.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {subItems.map((subItem) => (
                <ItemCard
                  key={subItem.id}
                  item={subItem}
                  onEdit={() =>
                    setDialogState({ mode: "edit", item: subItem, open: true })}
                  onRemove={() => gearApi.remove(subItem)}
                />
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={12} />}
                onClick={() =>
                  setDialogState({
                    mode: "create",
                    parentId: item.id,
                    open: true,
                  })}
                color="secondary"
                fullWidth
              >
                Add sub-item
              </Button>
            </Stack>
          </Box>
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
