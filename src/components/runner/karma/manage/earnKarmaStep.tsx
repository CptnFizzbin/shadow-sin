import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"

import { ManageKarmaStepDialog } from "./manageKarmaStepDialog.tsx"
import { ManageKarmaStepHeader } from "./manageKarmaStepHeader.tsx"
import type { ManageKarmaStepProps } from "./manageKarmaStepProps.ts"

/** Manage Karma step for recording karma awarded by the GM. */
export const EarnKarmaStep: FC<ManageKarmaStepProps> = ({ ctrl, onBack }) => {
  const dispatch = useRunnerStoreDispatch()

  const form = useAppForm({
    defaultValues: { amount: 1 },
    onSubmit: ({ value }) => {
      if (value.amount !== undefined) dispatch(Actions.karma.addKarma(value.amount))
      ctrl.close()
    },
  })

  return (
    <ManageKarmaStepDialog ctrl={ctrl}>
      <Dialog.Title>
        <ManageKarmaStepHeader title="Earn Karma" onBack={onBack} />
      </Dialog.Title>
      <Dialog.Content>
        <form.AppForm>
          <Stack sx={{ pt: 1 }}>
            <form.AppField
              name="amount"
              validators={{
                onChange: z.number().int().min(1, "Amount must be at least 1"),
              }}
            >
              {(field) => <field.CounterField label="Amount" min={1} fullWidth />}
            </form.AppField>
          </Stack>
        </form.AppForm>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button color="secondary" variant="contained" onClick={() => form.handleSubmit()}>
          Earn
        </Button>
      </Dialog.Actions>
    </ManageKarmaStepDialog>
  )
}
