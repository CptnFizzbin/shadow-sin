import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { z } from "zod"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

interface AddReputationEntryFormProps extends ControlledDialogProps<void> {}

const AddReputationEntryForm: FC<AddReputationEntryFormProps> = ({ ctrl }) => {
  const dispatch = useRunnerStoreDispatch()

  const form = useAppForm({
    defaultValues: {
      stat: "streetCred" as ReputationStatType,
      amount: 1,
      description: "",
    },
    onSubmit: ({ value }) => {
      if (value.description.trim()) {
        dispatch(Actions.reputation.addReputationEntry(value.stat, value.amount, value.description))
      }
      ctrl.close()
    },
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs" onClose={false}>
      <Dialog.Title>Add Reputation Event</Dialog.Title>

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
                      variant={field.state.value === "streetCred" ? "contained" : "outlined"}
                      onClick={() => field.handleChange("streetCred")}
                      sx={{ flex: 1 }}
                    >
                      Street Cred
                    </Button>
                    <Button
                      variant={field.state.value === "notoriety" ? "contained" : "outlined"}
                      onClick={() => field.handleChange("notoriety")}
                      sx={{ flex: 1 }}
                    >
                      Notoriety
                    </Button>
                    <Button
                      variant={field.state.value === "publicAwarenessModifier" ? "contained" : "outlined"}
                      onClick={() => field.handleChange("publicAwarenessModifier")}
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
                  helperText="Positive to increase, negative to decrease"
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
          Add Event
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useAddReputationEntryForm = () => useDialog<void>((ctrl) => <AddReputationEntryForm ctrl={ctrl} />)
