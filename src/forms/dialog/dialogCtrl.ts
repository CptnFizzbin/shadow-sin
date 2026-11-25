import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"

import { markOverlayClosed, markOverlayOpened } from "./openOverlayTracker.ts"

/**
 * Controls the lifecycle of a single dialog. Created locally via `useDialogCtrl()`
 * (or internally by `useDialog()`) and handed to `ControlledDialog`, or spread via
 * `useDialogProps(ctrl)` onto a raw `Dialog` for manual control.
 */
export class DialogCtrl<TReturn> {
  /** Reactive store tracking whether the dialog is currently open. */
  readonly store = createCompatStore<{ open: boolean }>({ open: false })

  private promise: Promise<TReturn | undefined>
  private resolve: (value: TReturn | undefined) => void
  private savedValue: TReturn | undefined = undefined

  constructor() {
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolve = resolve
  }

  /**
   * Open the dialog. Resets the result promise and transitions `store.open` to `true`.
   * Returns a promise that resolves when the dialog is closed.
   *
   * Safe to call again before a previous `open()` has resolved — any pending
   * previous promise resolves to `undefined` first, rather than hanging forever.
   */
  open(): Promise<TReturn | undefined> {
    this.resolve(undefined)
    const { promise, resolve } = Promise.withResolvers<TReturn | undefined>()
    this.promise = promise
    this.resolve = resolve
    this.savedValue = undefined
    if (!this.store.getState().open) {
      markOverlayOpened()
    }
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
   * Safe to call multiple times — the promise resolves only once.
   */
  close(value?: TReturn): void {
    if (value !== undefined) {
      this.savedValue = value
    }
    this.resolve(this.savedValue)
    if (this.store.getState().open) {
      markOverlayClosed()
    }
    this.store.setState(() => ({ open: false }))
  }

  /** Resolves when the dialog is closed. */
  result(): Promise<TReturn | undefined> {
    return this.promise
  }

  /**
   * Release overlay-tracking state without resolving the result promise. Call
   * from an unmount cleanup so a dialog torn down without an explicit
   * `close()` (e.g. its page unmounts from navigating away) doesn't
   * permanently count as "open".
   */
  dispose(): void {
    if (this.store.getState().open) {
      markOverlayClosed()
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDialogCtrl = DialogCtrl<any>
