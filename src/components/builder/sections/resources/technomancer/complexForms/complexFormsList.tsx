import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useComplexFormsBuildPoints } from "#/components/builder/buildPoints/hooks/useComplexFormsBuildPoints.ts"
import {
  ComplexFormsListItem,
} from "#/components/builder/sections/resources/technomancer/complexForms/complexFormsListItem.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { useMaxComplexForms } from "#/components/character/technomancer/complexFormsHooks.ts"
import { selectAllComplexForms } from "#/components/character/technomancer/complexFormsSelectors.ts"
import {
  useComplexFormDialog,
} from "#/components/character/technomancer/dialogs/complexFormDialog.tsx"
import { useComplexFormsStore } from "#/components/character/technomancer/useComplexFormsStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { getProgress } from "#/lib/progressUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

export const ComplexFormsList: FC = () => {
  const resonance = useAttr(AttributeKey.resonance)
  const complexFormsStore = useComplexFormsStore()
  const complexForms = useStore(complexFormsStore, selectAllComplexForms)
  const complexFormsBp = useComplexFormsBuildPoints()
  const maxComplexForms = useMaxComplexForms()
  const complexFormDialog = useComplexFormDialog()

  const isAtMax = complexForms.length >= maxComplexForms

  const handleAddForm = async () => {
    const saved = await complexFormDialog.open({ maxRating: resonance }).result()
    if (saved) complexFormsStore.save(saved)
  }

  const handleEditForm = async (complexForm: ComplexFormData) => {
    const saved = await complexFormDialog
      .open({
        form: complexForm,
        maxRating: resonance,
        onDelete: () => complexFormsStore.remove(complexForm.id),
      })
      .result()
    if (saved) complexFormsStore.save(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
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
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No complex forms added
        </Typography>
      )}

      {complexForms.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          {complexForms.map((complexForm) => (
            <ComplexFormsListItem
              key={complexForm.id}
              form={complexForm}
              onEdit={() => handleEditForm(complexForm)}
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
        onClick={handleAddForm}
        disabled={isAtMax}
      >
        Add Complex Form
      </Button>
    </Stack>
  )
}
