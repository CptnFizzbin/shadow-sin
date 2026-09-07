import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { z } from "zod"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ReputationLedgerEntry } from "#/system/reputation/reputationLedgerEntry.ts"
import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

type ReputationEntryFormProps = ControlledDialogProps<void> & (
  | { mode: "create" }
  | { mode: "edit", entry: ReputationLedgerEntry }
)

/**
 * The Add/Edit Reputation Event dialog — same fields and layout either way, differing only in
 * title, submit label, default values, and which action `mode` dispatches on submit.
 */
export const ReputationEntryForm: FC<ReputationEntryFormProps> = (props) => {
  const { ctrl, mode } = props
  const dispatch = useRunnerStoreDispatch()

  const form = useAppForm({
    defaultValues: mode === "edit"
      ? { stat: props.entry.stat, amount: props.entry.amount, description: props.entry.description }
      : { stat: ReputationStatType.streetCred, amount: 1, description: "" },
    onSubmit: ({ value }) => {
      if (value.description.trim()) {
        if (mode === "edit") {
          dispatch(Actions.reputation.editReputationEntry(props.entry.id, value.stat, value.amount, value.description))
        } else {
          dispatch(Actions.reputation.addReputationEntry(value.stat, value.amount, value.description))
        }
      }
      ctrl.close()
    },
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs" onClose={false}>
      <Dialog.Title>{mode === "edit" ? "Edit Reputation Event" : "Add Reputation Event"}</Dialog.Title>

      <Dialog.Content>
        <form.AppForm>
          <Stack sx={{ gap: 2, pt: 1 }}>
            {/* Stat Selection */}
            <Stack sx={{ gap: 0.5 }}>
              <Typography variant="subtitle2">Affected Stat</Typography>
              <form.AppField name="stat">
                {(field) => (
                  <ButtonGroup size="small" fullWidth>
                    <Button
                      variant={field.state.value === ReputationStatType.streetCred ? "contained" : "outlined"}
                      onClick={() => field.handleChange(ReputationStatType.streetCred)}
                      sx={{ flex: 1 }}
                    >
                      Street Cred
                    </Button>
                    <Button
                      variant={field.state.value === ReputationStatType.notoriety ? "contained" : "outlined"}
                      onClick={() => field.handleChange(ReputationStatType.notoriety)}
                      sx={{ flex: 1 }}
                    >
                      Notoriety
                    </Button>
                    <Button
                      variant={field.state.value === ReputationStatType.publicAwareness ? "contained" : "outlined"}
                      onClick={() => field.handleChange(ReputationStatType.publicAwareness)}
                      sx={{ flex: 1 }}
                    >
                      Awareness Mod
                    </Button>
                  </ButtonGroup>
                )}
              </form.AppField>
            </Stack>

            {/* Amount Counter */}
            <form.AppField
              name="amount"
              validators={{
                onChange: z.number().int(),
              }}
            >
              {(field) => (
                <field.CounterField
                  label="Value"
                  helperText="Relative bonus/penalty"
                  fullWidth
                />
              )}
            </form.AppField>

            {/* Description */}
            <form.AppField
              name="description"
              validators={{
                onChange: z.string().min(1, "Description is required"),
              }}
            >
              {(field) => (
                <TextField
                  label="Notes"
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  variant="outlined"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Successful run for CorpSec, public heroics, etc."
                  error={field.state.meta.errors && field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            </form.AppField>
          </Stack>
        </form.AppForm>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => form.handleSubmit()}
        >
          {mode === "edit" ? "Save Changes" : "Add Event"}
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}
