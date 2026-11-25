/** History state an open dialog's back-button guard entry carries. */
export const dialogBackGuardState = { dialogBackGuard: true }

/**
 * Whether a history entry's `state` marks it as the entry an open dialog pushed to catch the
 * browser's back button, rather than a real navigation.
 *
 * @param state - the history entry's state object
 * @returns `true` for a dialog's back-button guard entry
 */
export const isDialogBackGuardState = (state: object): boolean => {
  return "dialogBackGuard" in state && state.dialogBackGuard === true
}
