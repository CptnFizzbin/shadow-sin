import { createStore } from "@tanstack/store"
import { produce } from "immer"
import type { FC, ReactNode } from "react"
import { createElement } from "react"

import { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import type { DialogApiDialogProps } from "./dialogApiDialog.ts"
import type { DialogApiStore } from "./dialogApiStore.ts"
import { DialogWrapper } from "./dialogWrapper.tsx"

/**
 * Top-level dialog manager. Open any dialog component from a callback without
 * needing to mount it in JSX or manage local `open` state.
 *
 * Dialogs are rendered inside the nearest {@link DialogApiProvider}. Mount one
 * provider near the root of your component tree. Multiple dialogs can be open
 * simultaneously — each gets its own stable entry in the provider.
 *
 * Obtain an instance via {@link useDialogApi} rather than constructing this directly:
 *
 * ```ts
 * const dialogApi = useDialogApi()
 * ```
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
 *   <Dialog open={open} onClose={() => onClose(false)} slotProps={{ transition: { onExited: onClosed } }}>
 *     <DialogTitle>Are you sure?</DialogTitle>
 *     <DialogActions>
 *       <Button onClick={() => onClose(false)}>Cancel</Button>
 *       <Button onClick={() => onClose(true)}>Confirm</Button>
 *     </DialogActions>
 *   </Dialog>
 * )
 *
 * // 2. Open it from any event handler or async function — no JSX required
 * const dialogApi = useDialogApi()
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
 */
export class DialogApi {
  public readonly store: DialogApiStore

  constructor(store?: DialogApiStore) {
    this.store = store ?? createStore({})
  }

  open<TReturn>(
    dialog: FC<DialogApiDialogProps<TReturn>>,
  ): DialogCtrl<TReturn> {
    const dialogId = crypto.randomUUID()

    const ctrl = new DialogCtrl<TReturn>()

    const element = createElement(DialogWrapper, {
      ctrl, dialog, onClosed: () => this.removeDialog(dialogId),
    })

    this.addDialog(dialogId, element)
    return ctrl
  }

  private addDialog(id: string, dialog: ReactNode) {
    this.store.setState(produce((prev) => {
      prev[id] = dialog
    }))
  }

  private removeDialog(id: string) {
    this.store.setState(produce((prev) => {
      delete prev[id]
    }))
  }
}
