import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import { GameEffectsFieldGroup } from "#/components/GameEffects/GameEffectsFieldGroup.tsx"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { ComplexFormData } from "#/lib/system/magic/complexFormData.ts"

interface ComplexFormDialogProps {
  open: boolean
  form?: ComplexFormData
  maxRating: number
  onSave: (form: ComplexFormData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const ComplexFormDialog: FC<ComplexFormDialogProps> = ({
  open,
  form,
  maxRating,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!form
  const effectiveMaxRating = Math.max(maxRating, 1)

  const appForm = useAppForm({
    defaultValues: {
      id: form?.id ?? crypto.randomUUID(),
      name: form?.name ?? "",
      rating: form?.rating ?? 1,
      effects: form?.effects ?? [],
    } satisfies ComplexFormData,
    onSubmit: ({ value }) => {
      onSave({ ...value, rating: Math.min(value.rating, effectiveMaxRating) })
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onTransitionExited={() => {
        appForm.reset()
        onClosed?.()
      }}
    >
      <DialogTitle>
        {isEditMode ? "Edit Complex Form" : "Add Complex Form"}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <appForm.AppForm>
          <Stack gap={2} sx={{ pt: 1 }}>
            <appForm.AppField
              name="name"
              validators={{ onChange: z.string().min(1, "Name is required") }}
            >
              {(field) => (
                <field.TextField
                  label="Program Name"
                  size="small"
                  fullWidth
                  autoFocus
                />
              )}
            </appForm.AppField>

            <appForm.AppField
              name="rating"
              validators={{
                onChange: z
                  .number()
                  .int()
                  .min(1, "Rating must be at least 1")
                  .max(effectiveMaxRating, `Rating cannot exceed ${effectiveMaxRating}`),
              }}
            >
              {(field) => (
                <field.NumberField
                  label="Rating"
                  size="small"
                  fullWidth
                  slotProps={{ htmlInput: { min: 1, max: effectiveMaxRating, step: 1 } }}
                />
              )}
            </appForm.AppField>

            <GameEffectsFieldGroup form={appForm} fields={{ effects: "effects" }} />
          </Stack>
        </appForm.AppForm>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <div>
          {onDelete && (
            <Button
              color="error"
              onClick={() => {
                onDelete()
                onClose()
              }}
            >
              Delete
            </Button>
          )}
        </div>
        <div>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={() => appForm.handleSubmit()}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
