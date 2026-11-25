/**
 * Observable open/closed state of one dialog, shaped for React's `useSyncExternalStore`: `getState`
 * returns the same snapshot until the state changes, and `subscribe` returns its unsubscribe function.
 */
export class DialogOpenStore {
  private state: { open: boolean } = { open: false }
  private readonly listeners = new Set<() => void>()

  readonly getState = (): { open: boolean } => this.state

  /**
   * Registers `listener` to be called after every change of the open state.
   *
   * @param listener - called with no arguments; read the new state with `getState`
   * @returns a function that unregisters `listener`
   */
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Sets the open state, notifying subscribers only when it changes.
   *
   * @param open - whether the dialog is open
   */
  setOpen(open: boolean): void {
    if (this.state.open === open) return
    this.state = { open }
    for (const listener of this.listeners) listener()
  }
}
