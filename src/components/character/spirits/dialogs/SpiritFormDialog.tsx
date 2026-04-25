import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

import { SpiritFormFields } from "#/components/character/spirits/form/SpiritFormFields.tsx"
import { useSpiritForm } from "#/components/character/spirits/form/useSpiritForm.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { dialogApi, type DialogApiDialogProps } from "#/components/ui/dialogs/dialogApi.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"

interface SpiritFormDialogProps extends DialogApiDialogProps<SpiritData> {
  spirit?: SpiritData
  tradition?: TraditionData
}

export const SpiritFormDialog: FC<SpiritFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  spirit,
  tradition,
}) => {
  const form = useSpiritForm({
    spirit,
    onSubmit: (values) => onClose(values),
  })

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      slotProps={{ transition: { onExited: onClosed } }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{spirit ? "Edit Spirit" : "Summon Spirit"}</DialogTitle>
      <DialogContent>
        <SpiritFormFields form={form} tradition={tradition} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              onClick={form.handleSubmit}
              variant="contained"
            >
              Save
            </Button>
          )}
        </form.Subscribe>
      </DialogActions>
    </Dialog>
  )
}

export const useSpiritFormDialog = () => {
  const tradition = useCharacterSheet((s) => s.tradition)

  return {
    open: (spirit?: SpiritData) =>
      dialogApi.open<SpiritData>((props) => <SpiritFormDialog {...props} spirit={spirit} tradition={tradition} />),
  }
}
