import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"

import type { DialogProps } from "#/components/ui/dialog/dialog.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { noop } from "#/lib/noop.ts"

import { useDialogApi } from "./api/dialogApiProvider.tsx"

interface ConfirmDialogProps extends Omit<DialogProps<boolean>, "children"> {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  cancelLabel?: string
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
  slotProps,
  onClose = noop,
  ...dialogProps
}) => {
  const cancelBtnProps = slotProps?.cancelButton ?? {}
  const confirmBtnProps = slotProps?.confirmButton ?? {}

  return (
    <Dialog {...dialogProps} onClose={() => onClose(false)}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>{body}</Dialog.Content>
      <Dialog.Actions>
        <Button
          color="secondary"
          {...cancelBtnProps}
          onClick={() => onClose(false)}
        >
          {cancelBtnProps.label ?? cancelLabel ?? "Cancel"}
        </Button>
        <Button
          color="error"
          variant="contained"
          {...confirmBtnProps}
          onClick={() => onClose(true)}
        >
          {confirmBtnProps.label ?? confirmLabel ?? "Ok"}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export const useConfirmDialog = () => {
  const dialogApi = useDialogApi()

  return {
    confirm: async (props: Omit<ConfirmDialogProps, keyof DialogProps>): Promise<boolean> => {
      return await dialogApi
        .open<boolean>((dialogProps) => <ConfirmDialog {...props} {...dialogProps} />)
        .result() ?? false
    },
  }
}
