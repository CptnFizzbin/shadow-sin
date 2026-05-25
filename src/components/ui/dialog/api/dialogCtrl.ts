import { createStore } from "@tanstack/store"

/**
 * Controls the lifecycle of a dialog.
 *
 * - **Inline** (`new DialogCtrl<TReturn>()`): `open()` transitions the already-rendered
 *   dialog to visible. Use with `ControlledDialog`.
 * - **API-managed** (via `DialogApi.open()`): the factory receives a `ctrl` that is
 *   pre-opened; callers use `ctrl.close()` / `ctrl.result()`.
 *
 * Both modes share the same `close()`, `onClosed()`, and `result()` interface.
 */
export class DialogCtrl<TReturn> {
  /** Reactive store tracking whether the dialog is currently open. */
  readonly store = createStore<{ open: boolean }>({ open: false })

  private promise: Promise<TReturn | undefined>
  private resolve: (value: TReturn | undefined) => void
  private savedValue: TReturn | undefined = undefined

  // For API-managed dialogs: callback that removes the entry from DialogApi store
  private onClosedCallback: (() => void) | undefined = undefined
  // Timer ID for the 5-second onClosed safety timeout
  private closeTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined

  constructor() {
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolve = resolve
  }

  /**
   * Open the dialog. Resets the result promise and transitions `store.open` to `true`.
   * Returns a promise that resolves when the dialog is closed.
   */
  open(): Promise<TReturn | undefined> {
    // Reset promise and transition to open
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolve = resolve
    this.savedValue = undefined
    this.store.setState(() => ({ open: true }))
    return this.promise
  }

  /**
   * Save a return value without closing the dialog. Call before `close()` to
   * stage a result, then call `close()` to resolve it.
   */
  save(value: TReturn): void {
    this.savedValue = value
  }

  /**
   * Close the dialog. Resolves the result promise with any staged or explicit
   * value and sets `store.open` to `false` to trigger the exit animation.
   *
   * If an `onClosed` callback is registered (API-managed dialogs), starts a
   * 5-second safety timeout that auto-evicts the dialog entry if `onClosed()`
   * is never called (e.g. exit animation callback was missed).
   *
   * Safe to call multiple times — the promise resolves only once.
   */
  close(value?: TReturn): void {
    if (value !== undefined) {
      this.savedValue = value
    }
    this.resolve(this.savedValue)
    this.store.setState(() => ({ open: false }))
    if (this.onClosedCallback && this.closeTimeoutId === undefined) {
      this.closeTimeoutId = setTimeout(() => {
        console.warn(
          "[DialogCtrl] onClosed() was not called within 5 seconds after close(). "
          + "Auto-evicting the dialog entry. "
          + "Ensure ControlledDialog (or your onClosed handler) is called after the exit animation.",
        )
        this.onClosed()
      }, 5000)
    }
  }

  /**
   * Call after the exit animation finishes. Clears the 5-second safety timeout
   * and invokes the registered cleanup callback (API-managed dialogs).
   * No-op for inline dialogs.
   */
  onClosed(): void {
    if (this.closeTimeoutId !== undefined) {
      clearTimeout(this.closeTimeoutId)
      this.closeTimeoutId = undefined
    }
    this.onClosedCallback?.()
    this.onClosedCallback = undefined
  }

  /** Resolves when the dialog is closed. */
  result(): Promise<TReturn | undefined> {
    return this.promise
  }

  // ---------------------------------------------------------------------------
  // Internal methods used by DialogApi — not part of the public API
  // ---------------------------------------------------------------------------

  /** @internal Called by DialogApi to immediately open an API-managed dialog. */
  _setOpen(): void {
    this.store.setState(() => ({ open: true }))
  }

  /** @internal Called by DialogApi to register the cleanup callback and enable the timeout. */
  _setOnClosedCallback(callback: () => void): void {
    this.onClosedCallback = callback
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDialogCtrl = DialogCtrl<any>
