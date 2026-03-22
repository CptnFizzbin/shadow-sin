import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useBuilderAttrValue } from "#/components/Character/Form/CharacterBuilderHooks.ts"
import type { ComplexFormFormState } from "#/components/Character/Form/Resources/AwakenedFormState.ts"
import {
  useComplexFormsBuildPoints,
  useComplexFormsSlice,
  useMaxComplexForms,
} from "#/components/Character/Form/Resources/Technomancer/ComplexFormsHooks.ts"
import { ComplexFormsListItem } from "#/components/Character/Form/Resources/Technomancer/ComplexFormsListItem.tsx"
import { ComplexFormDialog } from "#/components/Character/Form/Resources/Technomancer/Dialogs/ComplexFormDialog.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

type ComplexFormDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; form: ComplexFormFormState; open: boolean }

export const ComplexFormsList: FC = () => {
  const resonance = useBuilderAttrValue(AttributeKey.resonance)
  const complexFormsSlice = useComplexFormsSlice()
  const complexFormsBp = useComplexFormsBuildPoints()
  const maxComplexForms = useMaxComplexForms()

  const [complexFormDialog, setComplexFormDialog] =
    useState<ComplexFormDialogState>(null)

  const addComplexForm = (form: ComplexFormFormState) => {
    complexFormsSlice.update((complexForms) => {
      complexForms.push(form)
    })
  }

  const updateComplexForm = (form: ComplexFormFormState) => {
    complexFormsSlice.update((complexForms) => {
      return complexForms.map((f) => (f.id === form.id ? form : f))
    })
  }

  const removeComplexForm = (formId: string) => {
    complexFormsSlice.update((complexForms) => {
      return complexForms.filter((f) => f.id !== formId)
    })
  }

  const closeDialog = () => {
    setComplexFormDialog((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = () => {
    setComplexFormDialog(null)
  }

  const isAtMax = complexFormsSlice.state.length >= maxComplexForms

  return (
    <Stack gap={1}>
      <Label label="Complex Forms" variant="outlined" />

      <Stack gap={0.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="text.secondary">
            {complexFormsSlice.state.length} / {maxComplexForms} forms
          </Typography>
          <Typography color="secondary.main">
            {complexFormsBp.spent} BP
          </Typography>
        </Stack>

        <LinearProgress
          variant={"determinate"}
          value={getProgress(complexFormsSlice.state.length, maxComplexForms)}
        />
      </Stack>

      {isAtMax && (
        <Alert severity="warning" sx={{ py: 0 }}>
          Maximum complex forms reached ({maxComplexForms})
        </Alert>
      )}

      {complexFormsSlice.state.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No complex forms added
        </Typography>
      )}

      {complexFormsSlice.state.length > 0 && (
        <Stack gap={0.5}>
          {complexFormsSlice.state.map((complexForm) => (
            <ComplexFormsListItem
              key={complexForm.id}
              form={complexForm}
              onEdit={() =>
                setComplexFormDialog({
                  mode: "edit",
                  form: complexForm,
                  open: true,
                })
              }
              onDelete={() => removeComplexForm(complexForm.id)}
            />
          ))}
        </Stack>
      )}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setComplexFormDialog({ mode: "create", open: true })}
        disabled={isAtMax}
      >
        Add Complex Form
      </Button>

      {complexFormDialog?.mode === "create" && (
        <ComplexFormDialog
          open={complexFormDialog.open}
          maxRating={resonance}
          onSave={(form) => {
            addComplexForm(form)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}

      {complexFormDialog?.mode === "edit" && (
        <ComplexFormDialog
          open={complexFormDialog.open}
          form={complexFormDialog.form}
          maxRating={resonance}
          onSave={(form) => {
            updateComplexForm(form)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}
    </Stack>
  )
}
