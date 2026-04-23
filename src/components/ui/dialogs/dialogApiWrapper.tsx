import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import type { DialogApiDialogProps } from "#/components/ui/dialogs/dialogApi.ts"
import type { DialogCtrl } from "#/components/ui/dialogs/dialogCtrl.ts"

/**
 * Accepts any dialog component regardless of its concrete TReturn type.
 * Type safety is enforced at the `DialogApi.open()` call site where TReturn
 * unifies the ctrl and dialogFc — using `any` here avoids unsafe double casts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDialogFc = FC<DialogApiDialogProps<any>>

interface DialogApiWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctrl: DialogCtrl<any>
  dialogFc: AnyDialogFc
  onClosed: () => void
}

/**
 * Internal component that bridges a `DialogCtrl` and a dialog FC.
 * Subscribes to `ctrl.isOpenStore` so the dialog gets `open=false` when
 * `ctrl.close()` is called, triggering the MUI close animation before cleanup.
 */
export const DialogApiWrapper: FC<DialogApiWrapperProps> = ({ ctrl, dialogFc: DialogFc, onClosed }) => {
  const isOpen = useStore(ctrl.isOpenStore, (state) => state)

  return (
    <DialogFc
      open={isOpen}
      onClose={(value) => ctrl.close(value)}
      onClosed={onClosed}
    />
  )
}
