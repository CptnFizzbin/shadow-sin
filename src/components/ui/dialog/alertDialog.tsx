import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"

import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

import type { ControlledDialogProps } from "./controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "./dialog.tsx"

interface AlertDialogProps extends ControlledDialogProps<void> {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  slotProps?: {
    confirmButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
  }
}

const AlertDialog: FC<AlertDialogProps> = ({
  ctrl,
  onClose,
  title,
  body,
  confirmLabel,
  slotProps,
}) => {
  const confirmBtnProps = slotProps?.confirmButton ?? {}

  return (
    <ControlledDialog ctrl={ctrl} onClose={onClose}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>{body}</Dialog.Content>
      <Dialog.Actions>
        <Button color="error" variant="contained" {...confirmBtnProps} onClick={() => ctrl.close()}>
          {confirmBtnProps.label ?? confirmLabel ?? "Ok"}
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useAlertDialog = () => useDialog<void, Omit<AlertDialogProps, keyof ControlledDialogProps>>(
  (ctrl, props) => <AlertDialog ctrl={ctrl} {...props} />,
)
