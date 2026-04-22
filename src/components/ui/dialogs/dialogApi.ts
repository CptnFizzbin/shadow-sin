import type { FC, ReactElement } from "react"
import { createElement } from "react"

import { DialogApiWrapper } from "#/components/ui/dialogs/dialogApiWrapper.tsx"
import { DialogCtrl } from "#/components/ui/dialogs/dialogCtrl.ts"
import { addRootDialog, removeRootDialog } from "#/components/ui/dialogs/rootDialogOutlet.tsx"

/**
 * Props injected by `DialogApi` into every dialog opened with a component type.
 * Your dialog component must accept (and use) all three props so that the API
 * can drive the open/close lifecycle and clean up after the transition.
 *
 * @example
 * ```tsx
 * const MyDialog: FC<DialogApiDialogProps<boolean>> = ({ open, onClose, onClosed }) => (
 *   <Dialog open={open} onClose={() => onClose(false)} onTransitionExited={onClosed}>
 *     …
 *     <Button onClick={() => onClose(true)}>Confirm</Button>
 *   </Dialog>
 * )
 *
 * const ctrl = dialogApi.open<boolean>(MyDialog)
 * const confirmed = await ctrl.result()
 * ```
 */
export interface DialogApiDialogProps<TReturn = void> {
  /** Whether the dialog is currently open. Driven by `DialogCtrl.isOpenStore`. */
  open: boolean
  /**
   * Call when the dialog should close. Resolves the promise returned by
   * `ctrl.result()` with the provided value and triggers the close animation.
   */
  onClose: (value: TReturn) => void
  /**
   * Call after the close animation has finished (e.g. MUI's `onTransitionExited`).
   * Removes the dialog from the root outlet so it unmounts cleanly.
   */
  onClosed: () => void
}

/**
 * Top-level dialog manager. Open any dialog component from a callback without
 * needing to mount it in JSX or manage local `open` state.
 *
 * Use the module-level `dialogApi` singleton rather than constructing this directly.
 */
export class DialogApi {
  /**
   * Mount a dialog component in the root outlet and return a `DialogCtrl` to
   * drive it. The component receives `open`, `onClose`, and `onClosed` as props.
   */
  open<TReturn>(dialogFc: FC<DialogApiDialogProps<TReturn>>): DialogCtrl<TReturn>

  /**
   * Mount a pre-constructed dialog element in the root outlet. Call
   * `ctrl.close()` to resolve the result promise and remove the element.
   * No animation management — the element is removed from the DOM immediately.
   */
  open(element: ReactElement): DialogCtrl<void>

  open<TReturn>(
    dialog: FC<DialogApiDialogProps<TReturn>> | ReactElement,
  ): DialogCtrl<TReturn> | DialogCtrl<void> {
    const dialogId = crypto.randomUUID()

    if (typeof dialog === "function") {
      const ctrl = new DialogCtrl<TReturn>()
      const onClosed = () => removeRootDialog(dialogId)
      const element = createElement(DialogApiWrapper, { ctrl, dialogFc: dialog, onClosed })
      addRootDialog(dialogId, element)
      return ctrl
    }

    const ctrl = new DialogCtrl<void>()
    ctrl.result().then(() => removeRootDialog(dialogId))
    addRootDialog(dialogId, dialog)
    return ctrl
  }
}

/** Module-level singleton. Import and call from anywhere — no hook required. */
export const dialogApi = new DialogApi()
