import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"

import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

import type { ControlledDialogProps } from "./controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "./dialog.tsx"

interface ConfirmDialogProps extends ControlledDialogProps<boolean> {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  slotProps?: {
    confirmButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
    cancelButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
  }
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  ctrl,
  onClose,
  title,
  body,
  confirmLabel,
  cancelLabel,
  slotProps,
}) => {
  const cancelBtnProps = slotProps?.cancelButton ?? {}
  const confirmBtnProps = slotProps?.confirmButton ?? {}

  return (
    <ControlledDialog ctrl={ctrl} onClose={onClose}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>{body}</Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" {...cancelBtnProps} onClick={() => ctrl.close(false)}>
          {cancelBtnProps.label ?? cancelLabel ?? "Cancel"}
        </Button>
        <Button color="error" variant="contained" {...confirmBtnProps} onClick={() => ctrl.close(true)}>
          {confirmBtnProps.label ?? confirmLabel ?? "Ok"}
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useConfirmDialog = () => {
  const { open, dialog } = useDialog<boolean, Omit<ConfirmDialogProps, keyof ControlledDialogProps<boolean>>>(
    (ctrl, props) => <ConfirmDialog ctrl={ctrl} {...props} />,
  )

  return {
    confirm: async (props: Omit<ConfirmDialogProps, keyof ControlledDialogProps<boolean>>) => (await open(props)) ?? false,
    dialog,
  }
}
