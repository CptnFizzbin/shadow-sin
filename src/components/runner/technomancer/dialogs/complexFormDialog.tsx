import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import { GameEffectsFieldGroup } from "#/components/system/gameEffects/gameEffectsFieldGroup.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { FormDialog } from "#/components/ui/dialog/formDialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

interface ComplexFormDialogProps extends ControlledDialogProps<ComplexFormData> {
  form?: ComplexFormData
  maxRating: number
  onDelete?: () => void
}

const ComplexFormDialog: FC<ComplexFormDialogProps> = ({
  ctrl,
  form,
  maxRating,
  onDelete,
}) => {
  const isEditMode = !!form
  const effectiveMaxRating = Math.max(maxRating, 1)

  const recordId = form?.id ?? NullUuid

  const appForm = useAppForm({
    defaultValues: {
      id: recordId,
      name: form?.name ?? "",
      rating: form?.rating ?? 1,
      effects: form?.effects ?? [],
    } satisfies ComplexFormData,
    onSubmit: ({ value }) => {
      ctrl.close({ ...value, rating: Math.min(value.rating, effectiveMaxRating) })
    },
  })

  return (
    <FormDialog
      ctrl={ctrl}
      title={isEditMode ? "Edit Complex Form" : "Add Complex Form"}
      onClosed={() => appForm.reset()}
      onDelete={onDelete}
      onSubmit={() => appForm.handleSubmit()}
      color="secondary"
    >
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
    </FormDialog>
  )
}

interface UseComplexFormDialogProps {
  form?: ComplexFormData
  maxRating: number
  onDelete?: () => void
}

export const useComplexFormDialog = () => useDialog<ComplexFormData, UseComplexFormDialogProps>(
  (ctrl, props) => (
    <ComplexFormDialog
      ctrl={ctrl}
      form={props.form}
      maxRating={props.maxRating}
      onDelete={props.onDelete}
    />
  ),
)
