import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useAttr } from "#/components/Character/character-utils.ts"
import {
  useComplexFormsBuildPoints,
} from "#/components/CharacterBuilder/BuildPoints/Hooks/use-complex-forms-build-points.ts"
import {
  ComplexFormDialog,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/complex-form-dialog.tsx"
import {
  ComplexFormsListItem,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/complex-forms-list-item.tsx"
import { useMaxComplexForms } from "#/components/Technomancer/complex-forms-hooks.ts"
import { useComplexFormsStore } from "#/components/Technomancer/use-complex-forms-store.ts"
import { BuildPoints } from "#/components/UI/build-points.tsx"
import { getProgress } from "#/lib/progress-utils.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { ComplexFormData } from "#/lib/system/magic/complex-form-data.ts"

type ComplexFormDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", form: ComplexFormData, open: boolean }

export const ComplexFormsList: FC = () => {
  const resonance = useAttr(AttributeKey.resonance)
  const complexFormsStore = useComplexFormsStore()
  const complexForms = useStore(complexFormsStore, (state) => state)
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
              onDelete={() => complexFormsStore.remove(complexForm.id)}
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
            complexFormsStore.add(form)
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
            complexFormsStore.update(form)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}
    </Stack>
  )
}
