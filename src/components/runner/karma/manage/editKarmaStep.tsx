import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { ManageKarmaStepDialog } from "./manageKarmaStepDialog.tsx"
import { ManageKarmaStepHeader } from "./manageKarmaStepHeader.tsx"
import type { ManageKarmaStepProps } from "./manageKarmaStepProps.ts"

/**
 * Manage Karma step for correcting current and total earned karma directly, outside the
 * earn/spend rules. Every change is still recorded in the karma log.
 */
export const EditKarmaStep: FC<ManageKarmaStepProps> = ({ ctrl, onBack }) => {
  const dispatch = useRunnerStoreDispatch()
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const totalKarma = useRunnerSelector(KarmaSelectors.selectTotal)

  const form = useAppForm({
    defaultValues: {
      current: currentKarma as number | undefined,
      total: totalKarma as number | undefined,
      reason: "",
    },
    onSubmit: ({ value }) => {
      const currentDelta = (value.current ?? currentKarma) - currentKarma
      const totalDelta = (value.total ?? totalKarma) - totalKarma
      if (currentDelta !== 0 || totalDelta !== 0) {
        dispatch(Actions.karma.adjustKarma({ currentDelta, totalDelta, reason: value.reason }))
      }
      ctrl.close()
    },
  })

  const hasChanges = useSelector(
    form.baseStore,
    (state) => state.values.current !== currentKarma || state.values.total !== totalKarma,
  )

  return (
    <ManageKarmaStepDialog ctrl={ctrl}>
      <Dialog.Title>
        <ManageKarmaStepHeader title="Edit Karma" onBack={onBack} />
      </Dialog.Title>
      <Dialog.Content>
        <form.AppForm>
          <Stack sx={{ pt: 1, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Set karma directly, without earning or spending it. The change is still recorded in the
              karma log.
            </Typography>
            <form.AppField name="current">
              {(field) => <field.CounterField label="Current" min={0} fullWidth />}
            </form.AppField>
            <form.AppField name="total">
              {(field) => <field.CounterField label="Total Earned" min={0} fullWidth />}
            </form.AppField>
            <form.AppField name="reason">
              {(field) => <field.TextField label="Reason" placeholder="Optional" />}
            </form.AppField>
          </Stack>
        </form.AppForm>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button
          color="secondary"
          variant="contained"
          disabled={!hasChanges}
          onClick={() => form.handleSubmit()}
        >
          Save
        </Button>
      </Dialog.Actions>
    </ManageKarmaStepDialog>
  )
}
