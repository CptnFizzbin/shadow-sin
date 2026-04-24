import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC, ReactNode } from "react"
import { useState } from "react"

export interface ConfirmDialogProps {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
  onClosed: () => void
  slotProps?: {
    confirmButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
    cancelButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
  }
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
  onClosed,
  slotProps,
}) => {
  const [open, setOpen] = useState<boolean>(true)

  const handleCancel = () => {
    onCancel()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      slotProps={{ transition: { onExited: onClosed } }}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions sx={{ padding: 1 }}>
        <Button
          color="secondary"
          onClick={handleCancel}
          {...slotProps?.cancelButton}
        >
          {slotProps?.cancelButton?.label ?? cancelLabel ?? "Cancel"}
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            onConfirm()
            setOpen(false)
          }}
          {...slotProps?.confirmButton}
        >
          {slotProps?.confirmButton?.label ?? confirmLabel ?? "Ok"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
