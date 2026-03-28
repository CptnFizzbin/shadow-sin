import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useBuilderAttrValue } from "#/components/CharacterBuilder/Hooks/UseBuilderAttrValue.ts"
import type { ComplexFormFormState } from "#/components/CharacterBuilder/Sections/Resources/AwakenedFormState.ts"
import {
  useComplexFormsBuildPoints,
  useMaxComplexForms,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexFormsHooks.ts"
import {
  ComplexFormsListItem,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexFormsListItem.tsx"
import {
  ComplexFormDialog,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Dialogs/ComplexFormDialog.tsx"
import {
  useBuilderComplexFormsApi,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseComplexFormsApi.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

type ComplexFormDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", form: ComplexFormFormState, open: boolean }

export const ComplexFormsList: FC = () => {
  const resonance = useBuilderAttrValue(AttributeKey.resonance)
  const { complexForms, addComplexForm, updateComplexForm, removeComplexForm } =
    useBuilderComplexFormsApi()
  const complexFormsBp = useComplexFormsBuildPoints()
  const maxComplexForms = useMaxComplexForms()

  const [complexFormDialog, setComplexFormDialog] =
    useState<ComplexFormDialogState>(null)

  const closeDialog = () => {
    setComplexFormDialog((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = () => {
    setComplexFormDialog(null)
  }

  const isAtMax = complexForms.length >= maxComplexForms

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
            {complexForms.length} / {maxComplexForms} forms
          </Typography>
          <BuildPoints value={complexFormsBp.spent} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={getProgress(complexForms.length, maxComplexForms)}
        />
      </Stack>

      {isAtMax && (
        <Alert severity="warning" sx={{ py: 0 }}>
          Maximum complex forms reached ({maxComplexForms})
        </Alert>
      )}

      {complexForms.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No complex forms added
        </Typography>
      )}

      {complexForms.length > 0 && (
        <Stack gap={0.5}>
          {complexForms.map((complexForm) => (
            <ComplexFormsListItem
              key={complexForm.id}
              form={complexForm}
              onEdit={() =>
                setComplexFormDialog({
                  mode: "edit",
                  form: complexForm,
                  open: true,
                })}
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
