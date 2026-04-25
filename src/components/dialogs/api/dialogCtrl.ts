import { createStore } from "@tanstack/store"

/**
 * Handle returned by `dialogApi.open()`. Allows the caller to programmatically
 * close the dialog and await its return value.
 */
export class DialogCtrl<TReturn> {
  /** Reactive store tracking whether the dialog is currently open. */
  readonly isOpenStore = createStore<boolean>(true)

  private readonly promise: Promise<TReturn | undefined>
  private readonly resolvePromise: (value: TReturn | undefined) => void
  private savedValue: TReturn | undefined = undefined

  constructor() {
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolvePromise = resolve
  }

  /**
   * Save a return value to be resolved when the dialog closes. Call this before
   * `onClose()` to provide a result without closing the dialog immediately.
   *
   * Typical usage in a factory dialog:
   * ```tsx
   * dialogApi.open({ render: (props, ctrl) => (
   *   <MyDialog {...props} onSave={(value) => ctrl.save(value)} />
   * ) })
   * ```
   */
  save(value: TReturn): void {
    this.savedValue = value
  }

  /**
   * Close the dialog. Resolves the promise returned by `result()` with the value
   * previously set via `save()`, or with the optional `value` argument (shorthand
   * for `save(value); close()`). Sets `isOpenStore` to `false` so the dialog
   * animates out.
   *
   * Safe to call multiple times — the promise resolves only once and subsequent
   * calls are no-ops.
   */
  close(value?: TReturn): void {
    if (value !== undefined) {
      this.savedValue = value
    }
    this.resolvePromise(this.savedValue)
    this.isOpenStore.setState(() => false)
  }

  /** Resolves when the dialog is closed (either by the user or by `close()`). */
  result(): Promise<TReturn | undefined> {
    return this.promise
  }
}
