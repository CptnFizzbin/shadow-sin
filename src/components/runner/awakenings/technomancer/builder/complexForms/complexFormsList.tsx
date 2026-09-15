import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { BuildPoints } from "#/components/builder/buildPoints.tsx"
import { useComplexFormDialog } from "#/components/runner/awakenings/technomancer/viewer/dialogs/complexFormDialog.tsx"
import { useComplexFormsBuildPoints } from "#/hooks/builder/buildPoints/useComplexFormsBuildPoints.ts"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ComplexFormsSelectors } from "#/state/runner/complexForms/complexForms.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { ComplexFormData } from "#/system/model/magic/complexFormData.ts"
import { getProgress } from "#/utils/progressUtils.ts"

import { ComplexFormsListItem } from "./complexFormsListItem.tsx"

export const ComplexFormsList: FC = () => {
  const resonance = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.resonance })
  const dispatch = useRunnerStoreDispatch()
  const complexForms = useRunnerSelector(ComplexFormsSelectors.selectVisible)
  const complexFormsBp = useComplexFormsBuildPoints()
  const maxComplexForms = useEntitySelector(ComplexFormsSelectors.selectMax)
  const complexFormDialog = useComplexFormDialog()

  const isAtMax = complexForms.length >= maxComplexForms

  const handleAddForm = async () => {
    const saved = await complexFormDialog.open({ maxRating: resonance })
    if (saved) dispatch(Actions.complexForms.saveComplexForm(saved))
  }

  const handleEditForm = async (complexForm: ComplexFormData) => {
    const saved = await complexFormDialog
      .open({
        form: complexForm,
        maxRating: resonance,
        onDelete: () => dispatch(Actions.complexForms.removeComplexForm(complexForm.id)),
      })
    if (saved) dispatch(Actions.complexForms.saveComplexForm(saved))
  }

  return (
    <Stack>
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
              onDelete={() => dispatch(Actions.complexForms.removeComplexForm(complexForm.id))}
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

      {complexFormDialog.outlet}
    </Stack>
  )
}
