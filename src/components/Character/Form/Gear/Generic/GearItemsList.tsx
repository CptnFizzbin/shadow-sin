import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"
import { GearItemFormDialog } from "#/components/Character/Form/Gear/Generic/Dialogs/GearItemFormDialog.tsx"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { getGearItemAvailability } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"

type DialogState =
  | null
  | { mode: "create"; open: boolean }
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

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAdd = (item: GearItemFormState) => {
    onAdd(item)
    onDialogClose()
  }

  const handleUpdate = (item: GearItemFormState) => {
    onUpdate(item)
    onDialogClose()
  }

  return (
    <>
      {items.map((item) => {
        const availability = getGearItemAvailability(item)

        return (
          <Box key={item.id}>
            <Stack
              direction="column"
              gap={0}
              sx={{
                p: 1,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => setDialogState({ mode: "edit", item, open: true })}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
                  {item.name}
                </Typography>

                <Typography variant="body2">
                  <Nuyen amount={item.cost} />
                </Typography>

                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(item.id)
                  }}
                >
                  <RiDeleteBin6Line size={16} />
                </IconButton>
              </Stack>

              {(availability || item.description || item.items.length > 0) && (
                <Stack direction="row" gap={1} sx={{ pt: 0.5 }} flexWrap="wrap">
                  {availability && (
                    <AvailabilityChip availability={availability} />
                  )}

                  {item.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ flexGrow: 1 }}
                    >
                      {item.description}
                    </Typography>
                  )}

                  {item.items.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {item.items.length} sub-item
                      {item.items.length !== 1 ? "s" : ""}
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </Box>
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", open: true })}
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
    </>
  )
}
