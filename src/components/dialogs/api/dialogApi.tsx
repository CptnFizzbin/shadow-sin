import { useSelector } from "@tanstack/react-store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import type { FC, ReactNode } from "react"
import { createElement } from "react"

import type { DialogApiStore } from "./dialogApiStore.ts"
import type { AnyDialogCtrl } from "./dialogCtrl.ts"
import { DialogCtrl } from "./dialogCtrl.ts"
import { DialogErrorBoundary } from "./dialogErrorBoundary.tsx"

// ---------------------------------------------------------------------------
// Internal wrapper components
// ---------------------------------------------------------------------------

interface OpenFactoryWrapperProps {
  ctrl: AnyDialogCtrl

  factory: (ctrl: AnyDialogCtrl, open: boolean) => ReactNode
}

/**
 * Wraps the factory passed to `DialogApi.open()` so the `open` boolean is
 * reactive — re-renders when `ctrl.store.open` changes so the dialog receives
 * `open=false` when `ctrl.close()` is called.
 */
const OpenFactoryWrapper: FC<OpenFactoryWrapperProps> = ({ ctrl, factory }) => {
  const isOpen = useSelector(ctrl.store, (state) => state.open)

  return <>{factory(ctrl, isOpen)}</>
}

// ---------------------------------------------------------------------------
// DialogApi
// ---------------------------------------------------------------------------

/**
 * Top-level dialog manager. Open any dialog component without mounting it in
 * JSX or managing local `open` state.
 *
 * Dialogs are rendered inside the nearest {@link DialogApiProvider}. Mount one
 * provider near the root of your component tree.
 *
 * ---
 *
 * ### Pattern 1 — raw factory (escape hatch)
 *
 * Receive `ctrl` and `open` in the factory. The `open` boolean is reactive.
 *
 * ```tsx
 * const { result } = dialogApi.open<boolean>((ctrl, open) => (
 *   <Dialog open={open} onClose={() => ctrl.close(false)} onClosed={() => ctrl.onClosed()}>
 *     <Button onClick={() => ctrl.close(true)}>Yes</Button>
 *   </Dialog>
 * ))
 * if (await result) deleteItem()
 * ```
 */
export class DialogApi {
  public readonly store: DialogApiStore

  constructor(store?: DialogApiStore) {
    this.store = store ?? createStore({})
  }

  /**
   * Mount a one-shot dialog via a factory function.
   *
   * The factory receives `ctrl` (to call `close()`) and `open` (a reactive
   * boolean that becomes `false` after `ctrl.close()` is called).
   *
   * Returns `{ result }` — a promise that resolves when the dialog closes.
   */
  open<TReturn>(
    factory: (ctrl: DialogCtrl<TReturn>, open: boolean) => ReactNode,
  ): { result: Promise<TReturn | undefined> } {
    const dialogId = crypto.randomUUID()
    const ctrl = new DialogCtrl<TReturn>()
    ctrl._setOpen()
    ctrl._setOnClosedCallback(() => this.removeDialog(dialogId))

    const inner = createElement(OpenFactoryWrapper, {
      ctrl,
      factory: factory as (ctrl: AnyDialogCtrl, open: boolean) => ReactNode,
    })
    const element = createElement(DialogErrorBoundary, { ctrl, children: inner })
    this.addDialog(dialogId, element)
    return { result: ctrl.result() }
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
