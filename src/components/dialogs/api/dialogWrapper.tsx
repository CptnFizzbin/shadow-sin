import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import type { AnyDialog } from "#/components/dialogs/api/dialogApiDialog.ts"
import type { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDialogCtrl = DialogCtrl<any>

interface DialogApiWrapperProps {
  ctrl: AnyDialogCtrl
  dialog: AnyDialog
  onClosed: () => void
}

/**
 * Internal component that bridges a `DialogCtrl` and a dialog FC.
 * Subscribes to `ctrl.isOpenStore` so the dialog gets `open=false` when
 * `ctrl.close()` is called, triggering the MUI close animation before cleanup.
 */
export const DialogWrapper: FC<DialogApiWrapperProps> = ({ ctrl, dialog: Dialog, onClosed }) => {
  return (
    <Dialog
      open={useStore(ctrl.isOpenStore, (state) => state)}
      onClose={(value) => ctrl.close(value)}
      onClosed={onClosed}
    />
  )
}
