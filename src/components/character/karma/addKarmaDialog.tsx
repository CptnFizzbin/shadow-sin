import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import type { DialogApiDialogProps } from "#/components/dialogs/api/dialogApiDialog.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"

export interface AddKarmaDialogProps extends DialogApiDialogProps {
  onSubmit: (amount: number) => void
}

export const AddKarmaDialog: FC<AddKarmaDialogProps> = ({
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
      fullWidth
      maxWidth="xs"
      slotProps={{
        transition: {
          onExited: () => {
            form.reset()
            onClosed()
          },
        },
      }}
    >
      <DialogTitle>Add Karma</DialogTitle>

      <DialogContent>
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
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={form.handleSubmit}
        >
          Add
        </Button>
      </DialogActions>
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
