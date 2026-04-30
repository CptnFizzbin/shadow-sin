import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"

import type { DialogProps } from "#/components/ui/dialog/dialog.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { noop } from "#/lib/noop.ts"

import { useDialogApi } from "./api/dialogApiProvider.tsx"

interface AlertDialogProps extends Omit<DialogProps<void>, "children"> {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  slotProps?: {
    confirmButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
  }
}

export const AlertDialog: FC<AlertDialogProps> = ({
  title,
  body,
  confirmLabel,
  slotProps,
  onClose = noop,
  ...dialogProps
}) => {
  const confirmBtnProps = slotProps?.confirmButton ?? {}

  return (
    <Dialog {...dialogProps}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>{body}</Dialog.Content>
      <Dialog.Actions>
        <Button
          color="error"
          variant="contained"
          {...confirmBtnProps}
          onClick={() => onClose()}
        >
          {confirmBtnProps.label ?? confirmLabel ?? "Ok"}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export const useAlertDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: async (props: Omit<AlertDialogProps, keyof DialogProps>): Promise<void> => {
      await dialogApi
        .open((dialogProps) => <AlertDialog {...props} {...dialogProps} />)
        .result()
    },
  }
}
