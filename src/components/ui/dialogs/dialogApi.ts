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
  onClose: (value?: TReturn) => void
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
 * Dialogs are rendered into the {@link RootDialogOutlet} that must be mounted
 * once near the root of your component tree. Multiple dialogs can be open
 * simultaneously — each gets its own stable entry in the outlet.
 *
 * Use the module-level {@link dialogApi} singleton rather than constructing
 * this directly.
 *
 * ---
 *
 * ### Basic usage — component overload (recommended)
 *
 * Define your dialog as a React component that accepts
 * {@link DialogApiDialogProps} and pass the component *type* (not an element)
 * to `open`. The API injects `open`, `onClose`, and `onClosed` automatically.
 *
 * ```tsx
 * // 1. Define the dialog component
 * const ConfirmDialog: FC<DialogApiDialogProps<boolean>> = ({ open, onClose, onClosed }) => (
 *   <Dialog open={open} onClose={() => onClose(false)} onTransitionExited={onClosed}>
 *     <DialogTitle>Are you sure?</DialogTitle>
 *     <DialogActions>
 *       <Button onClick={() => onClose(false)}>Cancel</Button>
 *       <Button onClick={() => onClose(true)}>Confirm</Button>
 *     </DialogActions>
 *   </Dialog>
 * )
 *
 * // 2. Open it from any event handler or async function — no JSX required
 * async function handleDelete() {
 *   const confirmed = await dialogApi.open<boolean>(ConfirmDialog).result()
 *   if (confirmed) deleteItem()
 * }
 * ```
 *
 * ### Passing data into a dialog
 *
 * Wrap your component in a closure (or a factory function) to forward extra
 * props before handing it to `open`:
 *
 * ```tsx
 * const RenameDialog: FC<DialogApiDialogProps<string> & { initialName: string }> = (
 *   { open, onClose, onClosed, initialName },
 * ) => { … }
 *
 * const newName = await dialogApi
 *   .open<string>((props) => <RenameDialog {...props} initialName={item.name} />)
 *   .result()
 * ```
 *
 * ### Programmatic close
 *
 * `open` returns a {@link DialogCtrl}. You can close the dialog from outside
 * the component (e.g. after an async operation completes):
 *
 * ```ts
 * const ctrl = dialogApi.open<void>(LoadingDialog)
 * await runLongOperation()
 * ctrl.close()           // resolves result() and triggers the close animation
 * await ctrl.result()    // await cleanup if needed
 * ```
 *
 * ### Raw element overload (advanced)
 *
 * Pass a pre-constructed `ReactElement` when you need full manual control.
 * The element is mounted as-is; call `ctrl.close()` to remove it. No
 * open/close animation management is provided by the API in this mode.
 *
 * ```tsx
 * const ctrl = dialogApi.open(<MyStaticBanner />)
 * // … later
 * ctrl.close()
 * ```
 *
 * Use the module-level `dialogApi` singleton rather than constructing this directly.
 */
export class DialogApi {
  /**
   * Mount a dialog component in the root outlet and return a `DialogCtrl` to
   * drive it. The component receives `open`, `onClose`, and `onClosed` as props.
   *
   * @param dialogFc - A React component that accepts {@link DialogApiDialogProps}.
   *   Pass the component *type*, not a JSX element. To forward extra props, wrap
   *   it in an arrow function: `(props) => <MyDialog {...props} extra={value} />`.
   * @returns A {@link DialogCtrl} whose `result()` promise resolves with the
   *   value passed to `onClose` (or `undefined` if closed without a value).
   */
  open<TReturn>(dialogFc: FC<DialogApiDialogProps<TReturn>>): DialogCtrl<TReturn>

  /**
   * Mount a pre-constructed dialog element in the root outlet. Call
   * `ctrl.close()` to resolve the result promise and remove the element.
   *
   * No animation management — the element is removed from the DOM immediately
   * when `ctrl.close()` is called. Prefer the component overload when you need
   * a proper open/close transition.
   *
   * @param element - A fully constructed `ReactElement` to mount in the outlet.
   * @returns A {@link DialogCtrl}<void> whose `result()` resolves when
   *   `ctrl.close()` is called.
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

/**
 * Module-level singleton. Import and call from anywhere — no hook required.
 *
 * @example
 * ```ts
 * import { dialogApi } from "#/components/ui/dialogs/dialogApi.ts"
 *
 * // Open a typed dialog and await the result
 * const confirmed = await dialogApi.open<boolean>(ConfirmDialog).result()
 *
 * // Open and close programmatically
 * const ctrl = dialogApi.open<void>(LoadingDialog)
 * await doWork()
 * ctrl.close()
 * ```
 */
export const dialogApi = new DialogApi()
