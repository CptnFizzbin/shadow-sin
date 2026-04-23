import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"

export interface AddKarmaDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
}

export const AddKarmaDialog: FC<AddKarmaDialogProps> = ({
  open,
  onClose,
  onClosed,
}) => {
  const karmaStore = useKarmaStore()
  const [amountInput, setAmountInput] = useState<string>("")

  const parsedAmount = parseInt(amountInput, 10)
  const isValid = !Number.isNaN(parsedAmount) && parsedAmount > 0

  const handleConfirm = () => {
    if (!isValid) return
    karmaStore.addKarma(parsedAmount)
    setAmountInput("")
    onClose()
  }

  const handleClose = () => {
    setAmountInput("")
    onClose()
  }

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>Add Karma</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <TextField
          label="Amount"
          type="number"
          autoFocus
          fullWidth
          size="small"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
          sx={{ marginTop: 1 }}
        />
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="secondary" variant="contained" disabled={!isValid} onClick={handleConfirm}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
