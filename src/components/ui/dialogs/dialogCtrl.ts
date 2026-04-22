import { createStore } from "@tanstack/store"

/**
 * Handle returned by `dialogApi.open()`. Allows the caller to programmatically
 * close the dialog and await its return value.
 */
export class DialogCtrl<TReturn> {
  /** Reactive store tracking whether the dialog is currently open. */
  readonly isOpenStore = createStore<boolean>(true)

  private readonly promise: Promise<TReturn>
  private resolvePromise!: (value: TReturn) => void

  constructor() {
    this.promise = new Promise<TReturn>((resolve) => {
      this.resolvePromise = resolve
    })
  }

  /**
   * Close the dialog with the given return value. Resolves the promise returned
   * by `result()` and sets `isOpenStore` to `false` so the dialog animates out.
   */
  close(value: TReturn): void {
    this.resolvePromise(value)
    this.isOpenStore.setState(() => false)
  }

  /** Resolves when the dialog is closed (either by the user or by `close()`). */
  result(): Promise<TReturn> {
    return this.promise
  }
}
