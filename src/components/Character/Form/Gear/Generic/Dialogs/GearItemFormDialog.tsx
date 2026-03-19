import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line, RiEditLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"
import { GearItemFormFields } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormFields.tsx"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import {
  gearItemFieldMap,
  useGearItemForm,
} from "#/components/Character/Form/Gear/Generic/Forms/UseGearItemForm.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"

interface GearItemFormDialogProps {
  open: boolean
  item?: GearItemFormState
  onClose: () => void
  onClosed?: () => void
  onSave: (item: GearItemFormState) => void
  label?: string
  allowSubItems?: boolean
}

export const GearItemFormDialog: FC<GearItemFormDialogProps> = ({
  open,
  item,
  onClose,
  onClosed,
  onSave,
  label = "Item",
  allowSubItems = true,
}) => {
  const editMode = !!item
  const [subItems, setSubItems] = useState<GearItemFormState[]>(
    item?.items ?? [],
  )
  const [subItemDialogState, setSubItemDialogState] = useState<
    | null
    | { mode: "create"; open: boolean }
    | { mode: "edit"; subItem: GearItemFormState; open: boolean }
  >(null)

  const form = useGearItemForm(
    editMode
      ? {
          mode: "edit",
          item,
          onSubmit: (saved) => onSave({ ...saved, items: subItems }),
        }
      : {
          mode: "create",
          onSubmit: (saved) => onSave({ ...saved, items: subItems }),
        },
  )

  const onSubItemDialogClose = () => {
    setSubItemDialogState((prev) => prev && { ...prev, open: false })
  }

  const onSubItemDialogClosed = () => {
    setSubItemDialogState(null)
  }

  const addSubItem = (subItem: GearItemFormState) => {
    setSubItems((prev) => [...prev, subItem])
    onSubItemDialogClose()
  }

  const saveSubItem = (subItem: GearItemFormState) => {
    setSubItems((prev) =>
      prev.map((existing) => (existing.id === subItem.id ? subItem : existing)),
    )
    onSubItemDialogClose()
  }

  const removeSubItem = (subItemId: string) => {
    setSubItems((prev) => prev.filter((existing) => existing.id !== subItemId))
  }

  const title = editMode ? `Edit ${label}` : `Add ${label}`

  return (
    <>
      <Dialog open={open} fullWidth onTransitionExited={onClosed}>
        <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

        <DialogContent sx={{ padding: 1 }}>
          <Stack gap={1} sx={{ padding: 1 }}>
            <GearItemFormFields form={form} fields={gearItemFieldMap} />

            {allowSubItems && (
              <>
                <Divider />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    Sub-Items
                  </Typography>

                  <Button
                    size="small"
                    startIcon={<RiAddLine size={14} />}
                    onClick={() =>
                      setSubItemDialogState({ mode: "create", open: true })
                    }
                  >
                    Add
                  </Button>
                </Stack>

                {subItems.map((subItem) => (
                  <Stack
                    key={subItem.id}
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={{
                      p: 0.5,
                      pl: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {subItem.name}
                    </Typography>

                    <Typography variant="body2">
                      <Nuyen amount={subItem.cost} />
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() =>
                        setSubItemDialogState({
                          mode: "edit",
                          subItem,
                          open: true,
                        })
                      }
                    >
                      <RiEditLine size={14} />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeSubItem(subItem.id)}
                    >
                      <RiDeleteBin6Line size={14} />
                    </IconButton>
                  </Stack>
                ))}
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ padding: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={form.handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {subItemDialogState?.mode === "create" && (
        <GearItemFormDialog
          open={subItemDialogState.open}
          label={label}
          allowSubItems={false}
          onSave={addSubItem}
          onClose={onSubItemDialogClose}
          onClosed={onSubItemDialogClosed}
        />
      )}

      {subItemDialogState?.mode === "edit" && (
        <GearItemFormDialog
          open={subItemDialogState.open}
          item={subItemDialogState.subItem}
          label={label}
          allowSubItems={false}
          onSave={saveSubItem}
          onClose={onSubItemDialogClose}
          onClosed={onSubItemDialogClosed}
        />
      )}
    </>
  )
}
