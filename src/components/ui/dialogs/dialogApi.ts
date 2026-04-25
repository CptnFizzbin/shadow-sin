import type { FC, ReactElement } from "react"
import { createElement, isValidElement } from "react"

import type { AnyDialogRenderFn } from "#/components/ui/dialogs/dialogApiWrapper.tsx"
import { DialogApiWrapper } from "#/components/ui/dialogs/dialogApiWrapper.tsx"
import { DialogCtrl } from "#/components/ui/dialogs/dialogCtrl.ts"
import { addRootDialog, removeRootDialog } from "#/components/ui/dialogs/rootDialogOutlet.tsx"

/**
 * Props injected by `DialogApi` into every dialog opened via `open()`.
 *
 * The `open` boolean used internally by the wrapper to drive MUI's close
 * animation is deliberately omitted from this public interface. The wrapper
 * always passes it at runtime, so dialogs that need it (e.g. to forward to a
 * MUI `<Dialog open={…}>`) can declare `open?: boolean` in their own props
 * type alongside `extends DialogApiDialogProps`.
 *
 * @example
 * ```tsx
 * // Simple dialog — no return value
 * const AlertDialog: FC<DialogApiDialogProps> = ({ onClose, onClosed }) => {
 *   const [open, setOpen] = useState(true)
 *   return (
 *     <Dialog open={open} onClose={() => { setOpen(false); onClose() }}
 *       slotProps={{ transition: { onExited: onClosed } }}>
 *       …
 *     </Dialog>
 *   )
 * }
 * await dialogApi.open(AlertDialog).result()
 *
 * // Dialog with a typed return value via the factory overload
 * interface SaveDialogProps extends DialogApiDialogProps {
 *   open?: boolean
 *   onSave?: (data: MyData) => void
 * }
 * const SaveDialog: FC<SaveDialogProps> = ({ open, onClose, onClosed, onSave }) => (
 *   <Dialog open={open ?? true} onClose={onClose}
 *     slotProps={{ transition: { onExited: onClosed } }}>
 *     <Button onClick={() => { onSave?.(data); onClose() }}>Save</Button>
 *   </Dialog>
 * )
 *
 * const result = await dialogApi
 *   .open<MyData>((props, ctrl) => (
 *     <SaveDialog {...props} onSave={(value) => ctrl.save(value)} />
 *   ))
 *   .result()
 * ```
 */
export interface DialogApiDialogProps {
  /**
   * Call when the dialog should close without a return value. Resolves the
   * promise returned by `ctrl.result()` with `undefined` (or with whatever
   * was previously saved via `ctrl.save()`) and triggers the close animation.
   *
   * Safe to call after `ctrl.close()` has already been called — subsequent
   * calls are no-ops.
   */
  onClose: () => void
  /**
   * Call after the close animation has finished (e.g. MUI
   * `slotProps.transition.onExited`). Removes the dialog from the root outlet
   * so it unmounts cleanly.
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
 * ### Factory overload — dialog with a typed return value (recommended)
 *
 * Pass a render function that receives `dialogProps` **and** a `DialogCtrl`.
 * Call `ctrl.save(value)` before `onClose()` to surface a typed result.
 *
 * ```tsx
 * interface RenameDialogProps extends DialogApiDialogProps {
 *   open?: boolean          // injected at runtime; declare here if needed
 *   onSave?: (name: string) => void
 * }
 *
 * const RenameDialog: FC<RenameDialogProps> = ({ open, onClose, onClosed, onSave }) => (
 *   <Dialog open={open ?? true} onClose={onClose}
 *     slotProps={{ transition: { onExited: onClosed } }}>
 *     …
 *     <Button onClick={() => { onSave?.(name); onClose() }}>Save</Button>
 *   </Dialog>
 * )
 *
 * const newName = await dialogApi
 *   .open<string>((props, ctrl) => (
 *     <RenameDialog {...props} initialName={item.name}
 *       onSave={(value) => ctrl.save(value)} />
 *   ))
 *   .result()
 * ```
 *
 * ### Component overload — simple dialog, result is always `undefined`
 *
 * Pass a component type directly when you do not need a return value. The API
 * injects `onClose` and `onClosed`; `open` is also passed at runtime so MUI
 * dialogs animate correctly.
 *
 * ```tsx
 * const AlertDialog: FC<DialogApiDialogProps & { open?: boolean }> = (
 *   { open, onClose, onClosed },
 * ) => (
 *   <Dialog open={open ?? true} onClose={onClose}
 *     slotProps={{ transition: { onExited: onClosed } }}>
 *     …
 *   </Dialog>
 * )
 *
 * await dialogApi.open(AlertDialog).result()
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
   * Mount a dialog using a factory render function that receives both
   * `dialogProps` and a `DialogCtrl`. Call `ctrl.save(value)` to record a
   * return value before `onClose()` triggers the close animation.
   *
   * @param factory - `(props: DialogApiDialogProps, ctrl: DialogCtrl<TReturn>) => ReactElement`.
   *   The factory is called during each render of the internal wrapper component.
   *   Do **not** call React hooks directly inside the factory — put hooks inside
   *   the dialog component the factory returns.
   * @returns A {@link DialogCtrl} whose `result()` resolves with the value
   *   passed to `ctrl.save()`, or `undefined` if the dialog was closed without
   *   saving.
   */
  open<TReturn>(
    factory: (props: DialogApiDialogProps, ctrl: DialogCtrl<TReturn>) => ReactElement,
  ): DialogCtrl<TReturn>

  /**
   * Mount a dialog component in the root outlet. The component receives
   * `onClose` and `onClosed` as props; `open` is also passed at runtime.
   * Because the component has no access to a `DialogCtrl`, the result is
   * always `undefined`. Use the factory overload when you need a typed result.
   *
   * @param component - A React component that accepts {@link DialogApiDialogProps}.
   * @returns A {@link DialogCtrl}<void> whose `result()` resolves with
   *   `undefined` when the dialog closes.
   */
  open(component: FC<DialogApiDialogProps>): DialogCtrl<void>

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

  open<TReturn>(dialog: ((props: DialogApiDialogProps, ctrl: DialogCtrl<TReturn>) => ReactElement) | FC<DialogApiDialogProps> | ReactElement): DialogCtrl<TReturn> | DialogCtrl<void> {
    const dialogId = crypto.randomUUID()

    if (isValidElement(dialog)) {
      const ctrl = new DialogCtrl<void>()
      ctrl.result().then(() => removeRootDialog(dialogId))
      addRootDialog(dialogId, dialog)
      return ctrl
    }

    const ctrl = new DialogCtrl<TReturn>()
    const onClosed = () => removeRootDialog(dialogId)

    // Normalise component (1-arg FC) and factory (2-arg function) to the same
    // AnyDialogRenderFn shape expected by DialogApiWrapper.
    const renderFn: AnyDialogRenderFn =
      dialog.length >= 2
        ? (dialog as AnyDialogRenderFn)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (props) => createElement(dialog as FC<any>, props)

    addRootDialog(dialogId, createElement(DialogApiWrapper, { ctrl, renderFn, onClosed }))
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
 * // Factory pattern — typed result via ctrl.save()
 * const result = await dialogApi
 *   .open<string>((props, ctrl) => (
 *     <MyDialog {...props} onSave={(value) => ctrl.save(value)} />
 *   ))
 *   .result()
 *
 * // Component pattern — no return value
 * await dialogApi.open(AlertDialog).result()
 *
 * // Open and close programmatically
 * const ctrl = dialogApi.open<void>(LoadingDialog)
 * await doWork()
 * ctrl.close()
 * ```
 */
export const dialogApi = new DialogApi()
