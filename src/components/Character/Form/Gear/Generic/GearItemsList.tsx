import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearItemFormDialog } from "#/components/Character/Form/Gear/Generic/Dialogs/GearItemFormDialog.tsx"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemCard } from "#/components/Character/Form/Gear/Generic/GearItemCard.tsx"

type DialogState =
  | null
  | { mode: "create"; parentId?: string; open: boolean }
  | { mode: "edit"; item: GearItemFormState; open: boolean }

interface GearItemsListProps {
  items: GearItemFormState[]
  onAdd: (item: GearItemFormState) => void
  onUpdate: (item: GearItemFormState) => void
  onRemove: (itemId: string) => void
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
      {items.map((item) => (
        <GearItemCard
          key={item.id}
          item={item}
          onEdit={() => setDialogState({ mode: "edit", item, open: true })}
          onRemove={() => onRemove(item.id)}
        />
      ))}

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
