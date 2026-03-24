import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearItemFormDialog } from "#/components/CharacterBuilder/Gear/Generic/Dialogs/GearItemFormDialog.tsx"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemCard } from "#/components/CharacterBuilder/Gear/Generic/GearItemCard.tsx"

type DialogState =
  | null
  | { mode: "create", parentId?: string, open: boolean }
  | { mode: "edit", item: GearItemFormState, open: boolean }

interface GearItemsListProps {
  items: GearItemFormState[]
  onAdd: (item: GearItemFormState) => void
  onUpdate: (item: GearItemFormState) => void
  onRemove: (item: GearItemFormState) => void
  label?: string
}

export const GearItemsList: FC<GearItemsListProps> = ({
  items,
  onAdd,
  onUpdate,
  onRemove,
  label = "Item",
}) => {
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

  const handleAdd = (item: GearItemFormState) => {
    const parentId =
      dialogState?.mode === "create" ? dialogState.parentId : undefined
    onAdd(parentId ? { ...item, parentId } : item)
    onDialogClose()
  }

  const handleUpdate = (item: GearItemFormState) => {
    onUpdate(item)
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
              onRemove={() => onRemove(item)}
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
                  onRemove={() => onRemove(subItem)}
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
        Add {label}
      </Button>

      {dialogState?.mode === "create" && (
        <GearItemFormDialog
          open={dialogState.open}
          label={dialogState.parentId ? `${label} sub-item` : label}
          onSave={handleAdd}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <GearItemFormDialog
          open={dialogState.open}
          item={dialogState.item}
          label={dialogState.item.parentId ? `${label} sub-item` : label}
          onSave={handleUpdate}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </Stack>
  )
}
