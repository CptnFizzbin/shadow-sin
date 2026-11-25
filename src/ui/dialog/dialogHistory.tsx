import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

/**
 * The slice of the browser history that dialogs use to close on the browser's back button.
 * The app supplies an implementation through `DialogHistoryProvider`.
 */
export interface DialogHistory {
  /**
   * Pushes a new entry for the current location, carrying `state`. The entry must be in the
   * browser's history by the time this returns.
   *
   * @param state - the history state the new entry carries
   */
  push: (state: object) => void
  /** Steps back one entry, as the browser's back button does. */
  back: () => void
  /**
   * Registers `listener` to be called whenever history steps back one or more entries,
   * whether by the browser's back button or by `back()`.
   *
   * @param listener - called after each back navigation
   * @returns a function that unregisters `listener`
   */
  subscribeToBack: (listener: () => void) => () => void
}

const DialogHistoryContext = createContext<DialogHistory | undefined>(undefined)

/**
 * Supplies the history that dialogs below it use to close on the browser's back button. Without
 * one, dialogs don't react to the back button.
 *
 * @param history - the history adapter; keep its identity stable, since every open dialog
 *   re-registers when it changes
 */
export const DialogHistoryProvider: FC<PropsWithChildren<{ history: DialogHistory }>> = ({
  history,
  children,
}) => (
  <DialogHistoryContext value={history}>{children}</DialogHistoryContext>
)

/** The nearest `DialogHistoryProvider`'s history, or `undefined` outside one. */
export const useDialogHistory = (): DialogHistory | undefined => useContext(DialogHistoryContext)
