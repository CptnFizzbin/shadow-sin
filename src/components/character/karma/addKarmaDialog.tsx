import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"

import { useKarmaStore } from "./useKarmaStore.ts"

interface AddKarmaDialogProps extends ControlledDialogProps<void> {}

const AddKarmaDialog: FC<AddKarmaDialogProps> = ({ ctrl }) => {
  const karmaStore = useKarmaStore()

  const form = useAppForm({
    defaultValues: { amount: 1 },
    onSubmit: ({ value }) => {
      if (value.amount !== undefined) karmaStore.addKarma(value.amount)
      ctrl.close()
    },
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs">
      <Dialog.Title>Add Karma</Dialog.Title>
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
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => form.handleSubmit()}
        >
          Add
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useAddKarmaDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: () => dialogApi.open<void>(
      (ctrl) => <AddKarmaDialog ctrl={ctrl} />,
    ),
  }
}
