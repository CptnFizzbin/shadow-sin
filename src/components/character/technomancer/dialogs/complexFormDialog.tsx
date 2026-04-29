import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { GameEffectsFieldGroup } from "#/components/system/gameEffects/gameEffectsFieldGroup.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

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

  const recordId = form?.id ?? NullUuid
  const dialogKey = `${recordId}-${open ? "1" : "0"}`

  const appForm = useAppForm({
    defaultValues: {
      id: recordId,
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
      key={dialogKey}
      open={open}
      maxWidth="sm"
      onClosed={() => {
        appForm.reset()
        onClosed?.()
      }}
    >
      <Dialog.Title>
        {isEditMode ? "Edit Complex Form" : "Add Complex Form"}
      </Dialog.Title>

      <Dialog.Content>
        <appForm.AppForm>
          <Stack sx={{ gap: 2, pt: 1 }}>
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
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box>
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
          </Box>
          <Box>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={() => appForm.handleSubmit()}>
              Save
            </Button>
          </Box>
        </Stack>
      </Dialog.Actions>
    </Dialog>
  )
}

export interface UseComplexFormDialogProps {
  form?: ComplexFormData
  maxRating: number
  onDelete?: () => void
}

export const useComplexFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseComplexFormDialogProps) => dialogApi.open<ComplexFormData>(
      (dialogProps) => (
        <ComplexFormDialog
          {...dialogProps}
          form={props.form}
          maxRating={props.maxRating}
          onDelete={props.onDelete}
          onSave={(complexForm) => dialogProps.onClose(complexForm)}
        />
      ),
    ),
  }
}
