import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import type { AnyDialog } from "./dialogApiDialog.ts"
import type { AnyDialogCtrl } from "./dialogCtrl.ts"
import { DialogErrorBoundary } from "./dialogErrorBoundary.tsx"

interface DialogApiWrapperProps {
  ctrl: AnyDialogCtrl
  dialog: AnyDialog
  onClosed: () => void
}

/**
 * Internal component that bridges a `DialogCtrl` and a dialog FC.
 * Subscribes to `ctrl.isOpenStore` so the dialog gets `open=false` when
 * `ctrl.close()` is called, triggering the MUI close animation before cleanup.
 *
 * Wraps the dialog in a {@link DialogErrorBoundary} so that `OutOfContextError`
 * thrown by the dialog component automatically resolves `ctrl.result()` and
 * cleans up the `DialogApi.store` entry via `onClosed`.
 */
export const DialogWrapper: FC<DialogApiWrapperProps> = ({ ctrl, dialog: Dialog, onClosed }) => {
  return (
    <DialogErrorBoundary ctrl={ctrl} onClosed={onClosed}>
      <Dialog
        open={useSelector(ctrl.isOpenStore, (state) => state)}
        onClose={(value) => ctrl.close(value)}
        onClosed={onClosed}
      />
    </DialogErrorBoundary>
  )
}
