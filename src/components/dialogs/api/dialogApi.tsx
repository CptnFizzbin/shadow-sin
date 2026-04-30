import { createStore } from "@tanstack/store"
import { useSelector } from "@tanstack/react-store"
import { produce } from "immer"
import type { FC, ReactNode } from "react"
import { createElement } from "react"

import type { DialogApiStore } from "./dialogApiStore.ts"
import { DialogCtrl } from "./dialogCtrl.ts"
import type { AnyDialogCtrl } from "./dialogCtrl.ts"
import { DialogErrorBoundary } from "./dialogErrorBoundary.tsx"

// ---------------------------------------------------------------------------
// Internal wrapper components
// ---------------------------------------------------------------------------

interface OpenFactoryWrapperProps {
  ctrl: AnyDialogCtrl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory: (ctrl: AnyDialogCtrl, open: boolean) => ReactNode
}

/**
 * Wraps the factory passed to `DialogApi.open()` so the `open` boolean is
 * reactive — re-renders when `ctrl.store.open` changes so the dialog receives
 * `open=false` when `ctrl.close()` is called.
 */
const OpenFactoryWrapper: FC<OpenFactoryWrapperProps> = ({ ctrl, factory }) => {
  const isOpen = useSelector(ctrl.store, (state) => state.open)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{factory(ctrl, isOpen)}</>
}

interface ControlledFactoryWrapperProps {
  ctrl: AnyDialogCtrl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory: (ctrl: AnyDialogCtrl, props: any) => ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
}

/**
 * Wraps the factory passed to `DialogApi.createControlled()`. No reactive
 * open-boolean is needed here because the dialog component uses
 * `ControlledDialog` internally, which subscribes to `ctrl.store` directly.
 */
const ControlledFactoryWrapper: FC<ControlledFactoryWrapperProps> = ({ ctrl, factory, props }) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{factory(ctrl, props)}</>
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
 *
 * ### Pattern 2 — `createControlled` (reusable dialog hook)
 *
 * ```tsx
 * // hook definition
 * export const useConfirmDialog = () => {
 *   const dialogApi = useDialogApi()
 *   return dialogApi.createControlled<boolean, ConfirmDialogProps>(
 *     (ctrl, props) => <ConfirmDialog ctrl={ctrl} {...props} />
 *   )
 * }
 *
 * // call site
 * const confirmDialog = useConfirmDialog()
 * const { result } = confirmDialog.open({ title: "Delete?", body: "..." })
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

    const element = createElement(
      DialogErrorBoundary,
      { ctrl },
      createElement(OpenFactoryWrapper, {
        ctrl,
        factory: factory as (ctrl: AnyDialogCtrl, open: boolean) => ReactNode,
      }),
    )
    this.addDialog(dialogId, element)
    return { result: ctrl.result() }
  }

  /**
   * Create a reusable ctrl whose `open(props)` mounts a new dialog via this
   * `DialogApi` each time it is called.
   *
   * @example
   * ```tsx
   * const ctrl = dialogApi.createControlled<boolean, ConfirmDialogProps>(
   *   (ctrl, props) => <ConfirmDialog ctrl={ctrl} {...props} />
   * )
   * const { result } = ctrl.open({ title: "Delete?", body: "..." })
   * if (await result) deleteItem()
   * ```
   */
  createControlled<TReturn, TProps = void>(
    factory: (
      ctrl: DialogCtrl<TReturn>,
      props: Omit<TProps, "ctrl" | "onClose">,
    ) => ReactNode,
  ): DialogCtrl<TReturn, TProps> {
    const outerCtrl = new DialogCtrl<TReturn, TProps>()

    outerCtrl._setOpenOverride((props?: Omit<TProps, "ctrl" | "onClose">) => {
      const dialogId = crypto.randomUUID()
      const innerCtrl = new DialogCtrl<TReturn>()
      innerCtrl._setOpen()
      innerCtrl._setOnClosedCallback(() => this.removeDialog(dialogId))

      const element = createElement(
        DialogErrorBoundary,
        { ctrl: innerCtrl },
        createElement(ControlledFactoryWrapper, {
          ctrl: innerCtrl,
          factory: factory as (ctrl: AnyDialogCtrl, props: unknown) => ReactNode,
          props: props ?? {},
        }),
      )
      this.addDialog(dialogId, element)
      return { result: innerCtrl.result() }
    })

    return outerCtrl
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
