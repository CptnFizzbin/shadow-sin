import { createStore } from "@tanstack/store"

/**
 * Controls the lifecycle of a dialog.
 *
 * Two usage modes:
 * - **Inline** (`new DialogCtrl<TReturn>()`): `open()` transitions the already-rendered
 *   dialog to visible. Use with `ControlledDialog` + `useDialogCtrl`.
 * - **API-managed** (`DialogCtrl<TReturn, TProps>` from `dialogApi.createControlled()`):
 *   `open(props)` mounts a new dialog via `DialogApi` each time.
 *
 * Both modes share the same `close()`, `onClosed()`, and `result()` interface.
 */
export class DialogCtrl<TReturn, TProps = void> {
  /** Reactive store tracking whether the dialog is currently open. */
  readonly store = createStore<{ open: boolean }>({ open: false })

  private promise: Promise<TReturn | undefined>
  private resolve: (value: TReturn | undefined) => void
  private savedValue: TReturn | undefined = undefined

  // For API-managed dialogs: callback that removes the entry from DialogApi store
  private onClosedCallback: (() => void) | undefined = undefined
  // Timer ID for the 5-second onClosed safety timeout
  private closeTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined
  // For createControlled: overrides the default open() behaviour
  private openOverride:
    | ((props?: Omit<TProps, "ctrl" | "onClose">) => { result: Promise<TReturn | undefined> })
    | undefined = undefined

  constructor() {
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolve = resolve
  }

  /**
   * Open the dialog.
   *
   * - For **inline** dialogs: transitions `store.open` to `true` and returns `{ result }`.
   * - For **createControlled** ctrls: mounts a new dialog via `DialogApi` and returns `{ result }`.
   */
  open(
    ...args: TProps extends void ? [] : [props: Omit<TProps, "ctrl" | "onClose">]
  ): { result: Promise<TReturn | undefined> } {
    if (this.openOverride) {
      return this.openOverride((args as [Omit<TProps, "ctrl" | "onClose">])[0])
    }
    // Default inline behaviour: reset promise and transition to open
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolve = resolve
    this.savedValue = undefined
    this.store.setState(() => ({ open: true }))
    return { result: this.promise }
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
          "[DialogCtrl] onClosed() was not called within 5 seconds after close(). " +
            "Auto-evicting the dialog entry. " +
            "Ensure ControlledDialog (or your onClosed handler) is called after the exit animation.",
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

  /** @internal Called by DialogApi.createControlled to override the default open() behaviour. */
  _setOpenOverride(
    fn: (props?: Omit<TProps, "ctrl" | "onClose">) => { result: Promise<TReturn | undefined> },
  ): void {
    this.openOverride = fn
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDialogCtrl = DialogCtrl<any>
