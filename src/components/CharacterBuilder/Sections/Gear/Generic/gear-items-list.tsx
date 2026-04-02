import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearItemFormDialog } from "#/components/CharacterBuilder/Sections/Gear/Generic/Dialogs/gear-item-form-dialog.tsx"
import { GearItemCard } from "#/components/CharacterBuilder/Sections/Gear/Generic/gear-item-card.tsx"
import { useGearApi } from "#/components/Gear/use-gear-api.ts"
import type { ItemData } from "#/lib/system/item-data.ts"

type DialogState =
  | null
  | { mode: "create", parentId?: UUID, open: boolean }
  | { mode: "edit", item: ItemData, open: boolean }

interface GearItemsListProps {
  items: ItemData[]
  itemType?: string
}

export const GearItemsList: FC<GearItemsListProps> = ({ itemType = "Item", items }) => {
  const gearApi = useGearApi()
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
      gearApi.add({ ...item, parentId })
    else
      gearApi.add(item)

    onDialogClose()
  }

  const handleUpdate = (item: ItemData) => {
    gearApi.set(item)
    onDialogClose()
  }

  return (
    <Stack gap={1}>
      {topLevelItems.map((item) => {
        const subItems = getSubItems(item.id)

        return (
          <Box key={item.id}>
            <GearItemCard
              item={item}
              onEdit={() => setDialogState({ mode: "edit", item, open: true })}
              onRemove={() => gearApi.remove(item)}
            />

            <Stack
              gap={1}
              sx={{
                paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: subItems.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: subItems.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {subItems.map((subItem) => (
                <GearItemCard
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
        Add {itemType}
      </Button>

      {dialogState?.mode === "create" && (
        <GearItemFormDialog
          open={dialogState.open}
          label={dialogState.parentId ? `${itemType} sub-item` : itemType}
          onSave={handleAdd}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <GearItemFormDialog
          open={dialogState.open}
          item={dialogState.item}
          label={dialogState.item.parentId ? `${itemType} sub-item` : itemType}
          onSave={handleUpdate}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </Stack>
  )
}
