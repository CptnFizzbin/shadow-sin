import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"
import { useState } from "react"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"

import { useDialogApi } from "./api/dialogApiProvider.tsx"

interface ConfirmDialogProps {
  title?: ReactNode
  body: ReactNode
  confirmLabel?: string
  onConfirm: () => void
  onClosed: () => void
  slotProps?: {
    confirmButton?: { label?: string } & Omit<ButtonProps, "onClick" | "children">
  }
}

export const AlertDialog: FC<ConfirmDialogProps> = ({
  title,
  body,
  confirmLabel,
  onConfirm,
  onClosed,
  slotProps,
}) => {
  const [open, setOpen] = useState<boolean>(true)

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onClosed={onClosed}
    >
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>{body}</Dialog.Content>
      <Dialog.Actions>
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
      </Dialog.Actions>
    </Dialog>
  )
}

export const useAlertDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: async (props: Omit<ConfirmDialogProps, "onCancel" | "onConfirm" | "onClosed">): Promise<boolean> => {
      return await dialogApi.open<boolean>((dialogProps) => {
        return (
          <AlertDialog
            {...props}
            {...dialogProps}
            onConfirm={() => dialogProps.onClose(true)}
          />
        )
      }).result() ?? false
    },
  }
}
