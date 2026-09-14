import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { ExtendedTestEntry } from "#/system/model/checks/extendedTestData.ts"

type ExtendedTestDialogProps = ControlledDialogProps<void> & (
  | { mode: "add" }
  | { mode: "edit", test: ExtendedTestEntry }
  )

/**
 * The Add/Edit Extended Test dialog — same fields either way, differing only in title, default
 * values, and which action `mode` dispatches on submit. `currentHits` and `attempts` are logged
 * from the card itself (see `ExtendedTestCard`), not edited here.
 */
const ExtendedTestDialog: FC<ExtendedTestDialogProps> = (props) => {
  const { ctrl, mode } = props
  const dispatch = useRunnerStoreDispatch()

  const form = useAppForm({
    defaultValues: mode === "edit"
      ? { description: props.test.description, interval: props.test.interval, hitsThreshold: props.test.hitsThreshold }
      : { description: "", interval: { days: 1 }, hitsThreshold: 1 },
    onSubmit: ({ value }) => {
      if (!value.description.trim()) return

      if (mode === "edit") {
        dispatch(Actions.extendedTests.updateExtendedTest({ ...props.test, ...value }))
      } else {
        dispatch(Actions.extendedTests.addExtendedTest({ ...value, currentHits: 0, attempts: 0 }))
      }
      ctrl.close()
    },
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs" onClose={false}>
      <Dialog.Title>{mode === "edit" ? "Edit Extended Test" : "Add Extended Test"}</Dialog.Title>

      <Dialog.Content>
        <form.AppForm>
          <Stack sx={{ gap: 2, pt: 1 }}>
            <form.AppField
              name="description"
              validators={{
                onChange: z.string().min(1, "Description is required"),
              }}
            >
              {(field) => (
                <field.TextField
                  label="Description"
                  placeholder="e.g., Researching a fixer's background"
                />
              )}
            </form.AppField>

            <form.AppField name="interval">
              {(field) => (
                <field.DurationField label="Interval" />
              )}
            </form.AppField>

            <form.AppField
              name="hitsThreshold"
              validators={{
                onChange: z.number().int().min(1),
              }}
            >
              {(field) => (
                <field.CounterField
                  label="Hits Threshold"
                  min={1}
                  fullWidth
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
          {mode === "edit" ? "Save Changes" : "Add Test"}
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useAddExtendedTestDialog = () => useDialog<void>(
  (ctrl) => <ExtendedTestDialog ctrl={ctrl} mode="add" />,
)

export const useEditExtendedTestDialog = () => useDialog<void, { test: ExtendedTestEntry }>(
  (ctrl, props) => <ExtendedTestDialog ctrl={ctrl} mode="edit" test={props.test} />,
)
