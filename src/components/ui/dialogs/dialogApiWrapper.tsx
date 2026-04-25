import { useStore } from "@tanstack/react-store"
import type { FC, ReactElement } from "react"

import type { DialogApiDialogProps } from "#/components/ui/dialogs/dialogApi.ts"
import type { DialogCtrl } from "#/components/ui/dialogs/dialogCtrl.ts"

/**
 * Accepts any DialogCtrl regardless of its concrete TReturn type.
 * Type safety is enforced at the `DialogApi.open()` call site — using `any`
 * here avoids unsafe double casts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDialogCtrl = DialogCtrl<any>

/**
 * The props the wrapper injects into every dialog at runtime. `open` is not
 * part of the public {@link DialogApiDialogProps} contract but is always
 * provided so that dialogs can drive a MUI close animation.
 */
type InjectedDialogProps = DialogApiDialogProps & { open: boolean }

/**
 * Unified render function type used internally. Both the 2-arg factory pattern
 * and components wrapped from the 1-arg overload conform to this shape.
 */

export type AnyDialogRenderFn = (props: InjectedDialogProps, ctrl: AnyDialogCtrl) => ReactElement

interface DialogApiWrapperProps {
  ctrl: AnyDialogCtrl
  renderFn: AnyDialogRenderFn
  onClosed: () => void
}

/**
 * Internal component that bridges a `DialogCtrl` and a dialog render function.
 * Subscribes to `ctrl.isOpenStore` so the dialog always receives the current
 * `open` value — enabling MUI's close animation when `ctrl.close()` is called
 * programmatically.
 */
export const DialogApiWrapper: FC<DialogApiWrapperProps> = ({ ctrl, renderFn, onClosed }) => {
  const isOpen = useStore(ctrl.isOpenStore, (state) => state)

  const dialogProps: InjectedDialogProps = {
    onClose: () => ctrl.close(),
    onClosed,
    open: isOpen,
  }

  return renderFn(dialogProps, ctrl)
}
