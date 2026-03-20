import { Button, type DialogProps } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import type { SinFormState } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"

interface SinRemoveDialogProps extends Omit<
  DialogProps,
  "onClose" | "onTransitionExited"
> {
  sin: SinFormState
  onConfirm: () => void
  onClose: () => void
  onClosed?: () => void
}

export const SinRemoveDialog: FC<SinRemoveDialogProps> = ({
  sin,
  onConfirm,
  onClose,
  onClosed,
  ...props
}) => {
  return (
    <Dialog {...props} onTransitionExited={onClosed}>
      <DialogTitle>Remove SIN</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to remove the SIN "{sin.name}"?
          <br />
          This will also remove all associated licenses.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="error" onClick={() => onConfirm()}>
          Remove SIN
        </Button>
      </DialogActions>
    </Dialog>
  )
}
