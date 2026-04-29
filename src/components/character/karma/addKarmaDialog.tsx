import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import type { DialogApiDialogProps } from "#/components/dialogs/api/dialogApiDialog.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"

export interface AddKarmaDialogProps extends DialogApiDialogProps {
  onSubmit: (amount: number) => void
}

const AddKarmaDialog: FC<AddKarmaDialogProps> = ({
  open = true,
  onClose,
  onClosed,
  onSubmit,
}) => {
  const form = useAppForm({
    defaultValues: { amount: 1 },
    onSubmit: ({ value }) => {
      if (value.amount !== undefined) {
        onSubmit(value.amount)
      }
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      onClosed={() => {
        form.reset()
        onClosed()
      }}
    >
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
        <Button color="secondary" onClick={() => onClose()}>
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
    </Dialog>
  )
}

interface UseAddKarmaDialogProps {
  onSubmit: (amount: number) => void
}

export const useAddKarmaDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseAddKarmaDialogProps) => dialogApi.open(
      (dialogProps) => (
        <AddKarmaDialog
          {...dialogProps}
          onSubmit={props.onSubmit}
        />
      ),
    ),
  }
}
