import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import type { AnyDialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import type { AnyDialog } from "./dialogApiDialog"

interface DialogApiWrapperProps {
  ctrl: AnyDialogCtrl
  dialog: AnyDialog
  onClosed: () => void
}

/**
 * Internal component that bridges a `DialogCtrl` and a dialog FC.
 * Subscribes to `ctrl.store` so the dialog gets `open=false` when
 * `ctrl.close()` is called, triggering the MUI close animation before cleanup.
 */
export const DialogWrapper: FC<DialogApiWrapperProps> = ({ ctrl, dialog: Dialog, onClosed }) => {
  return (
    <Dialog
      open={useSelector(ctrl.store, DialogCtrl.selectors.selectIsOpen)}
      onClose={(value) => ctrl.close(value)}
      onClosed={onClosed}
    />
  )
}
