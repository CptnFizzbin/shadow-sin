import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearItemFormDialog } from "#/components/CharacterBuilder/Gear/Generic/Dialogs/GearItemFormDialog.tsx"
import { GearItemCard } from "#/components/CharacterBuilder/Gear/Generic/GearItemCard.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

type DialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; item: GearData; open: boolean }

interface GearItemsListProps {
  items: GearData[]
  onAdd: (item: GearData) => void
  onUpdate: (item: GearData) => void
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

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAdd = (item: GearData) => {
    onAdd(item)
    onDialogClose()
  }

  const handleUpdate = (item: GearData) => {
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
          label={label}
          onSave={handleAdd}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <GearItemFormDialog
          open={dialogState.open}
          item={dialogState.item}
          label={label}
          onSave={handleUpdate}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </Stack>
  )
}
