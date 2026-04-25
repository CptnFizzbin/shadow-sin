import { createStore } from "@tanstack/store"

type DialogCtrlState = { open: boolean }

/**
 * Handle returned by `api.open()`. Allows the caller to programmatically
 * close the dialog and await its return value.
 */
export class DialogCtrl<TReturn> {
  static readonly selectors = {
    selectIsOpen: (state: DialogCtrlState) => state.open,
  }

  /** Reactive store tracking whether the dialog is currently open. */
  public readonly store = createStore<DialogCtrlState>({ open: true })
  private readonly promise: Promise<TReturn | undefined>
  private readonly resolvePromise: (value: TReturn | undefined) => void

  constructor() {
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolvePromise = resolve
  }

  /**
   * Close the dialog with an optional return value. Resolves the promise returned
   * by `result()` and sets `isOpenStore` to `false` so the dialog animates out.
   *
   * For `DialogCtrl<void>`, this can be called as `close()` with no arguments.
   */
  close(value?: TReturn): void {
    this.resolvePromise(value)
    this.store.setState(() => ({ open: false }))
  }

  /** Resolves when the dialog is closed (either by the user or by `close()`). */
  result(): Promise<TReturn | undefined> {
    return this.promise
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDialogCtrl = DialogCtrl<any>
