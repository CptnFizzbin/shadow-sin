import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { useState } from "react"

export interface ConfirmDialogProps extends PropsWithChildren {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
  onClosed: () => void
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
  onClosed,
}) => {
  const [open, setOpen] = useState<boolean>(true)

  return (
    <Dialog
      open={open}
      onTransitionExited={onClosed}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions sx={{ padding: 1 }}>
        <Button
          color="secondary"
          onClick={() => {
            onCancel()
            setOpen(false)
          }}
        >
          {cancelLabel ?? "Cancel"}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            onConfirm()
            setOpen(false)
          }}
        >
          {confirmLabel ?? "Ok"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
