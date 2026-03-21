import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import { ComplexFormDialog } from "#/components/Character/Form/Resources/Technomancer/Dialogs/ComplexFormDialog.tsx"
import type { ComplexFormFormState } from "#/components/Character/Form/Resources/Technomancer/TechnomancerFormState.ts"
import { getComplexFormBp } from "#/components/Character/Form/Resources/Technomancer/TechnomancerRequirements.ts"
import { useTechnomancerFormGroup } from "#/components/Character/Form/Resources/Technomancer/UseTechnomancerFormGroup.ts"
import { Label } from "#/components/UI/Text/Label.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"

type ComplexFormDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; form: ComplexFormFormState; open: boolean }

export const ComplexFormsFormGroup: FC = () => {
  const {
    complexForms,
    resonanceValue,
    maxComplexForms,
    totalComplexFormsBp,
    addComplexForm,
    updateComplexForm,
    removeComplexForm,
  } = useTechnomancerFormGroup()

  const [complexFormDialog, setComplexFormDialog] =
    useState<ComplexFormDialogState>(null)

  const closeDialog = <TDialogState,>(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = <TDialogState,>(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter(null)
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
          <Typography color="secondary.main">
            {totalComplexFormsBp} BP
          </Typography>
        </Stack>

        <LinearProgress
          variant={"determinate"}
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
            <ComplexFormRow
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
          maxRating={resonanceValue}
          onSave={(form) => {
            addComplexForm(form)
            closeDialog(setComplexFormDialog)
          }}
          onClose={() => closeDialog(setComplexFormDialog)}
          onClosed={() => clearDialog(setComplexFormDialog)}
        />
      )}

      {complexFormDialog?.mode === "edit" && (
        <ComplexFormDialog
          open={complexFormDialog.open}
          form={complexFormDialog.form}
          maxRating={resonanceValue}
          onSave={(form) => {
            updateComplexForm(form)
            closeDialog(setComplexFormDialog)
          }}
          onDelete={() => {
            removeComplexForm(complexFormDialog.form.id)
            clearDialog(setComplexFormDialog)
          }}
          onClose={() => closeDialog(setComplexFormDialog)}
          onClosed={() => clearDialog(setComplexFormDialog)}
        />
      )}
    </Stack>
  )
}

interface ComplexFormRowProps {
  form: ComplexFormFormState
  onEdit: () => void
  onDelete: () => void
}

const ComplexFormRow: FC<ComplexFormRowProps> = ({
  form,
  onEdit,
  onDelete,
}) => {
  const bpCost = getComplexFormBp(form.rating)

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {form.name}
        </Typography>

        <Chip
          label={form.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />

        <Typography
          variant="caption"
          color="secondary.main"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {bpCost} BP
        </Typography>

        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <RiDeleteBin6Line size={14} />
        </IconButton>
      </Stack>
    </Box>
  )
}
