import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"

import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import type { ControlledDialogProps } from "./api/controlledDialogProps.ts"
import { useDialogApi } from "./api/dialogApiProvider.tsx"

interface AlertDialogProps extends ControlledDialogProps<void> {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  slotProps?: {
    confirmButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
  }
}

export const AlertDialog: FC<AlertDialogProps> = ({
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

export const useAlertDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: async (props: Omit<AlertDialogProps, keyof ControlledDialogProps<void>>): Promise<void> => {
      await dialogApi.open<void>((ctrl) => (
        <AlertDialog ctrl={ctrl} {...props} />
      )).result
    },
  }
}
