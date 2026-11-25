import type { ParsedLocation } from "@tanstack/react-router"

/** History state an open dialog's back-button guard entry carries. */
export const dialogBackGuardState = { dialogBackGuard: true }

/**
 * Whether `location` is the history entry an open dialog pushed to catch the browser's back
 * button, rather than a real navigation.
 */
const isDialogBackGuardLocation = (location: ParsedLocation): boolean => {
  return "dialogBackGuard" in location.state && location.state.dialogBackGuard === true
}

/**
 * Creates a router `scrollRestoration` callback that leaves the scroll position alone when a
 * dialog pushes its back-button guard entry, and when history returns from that entry to the page
 * the dialog opened over. Every other navigation restores scroll as usual.
 */
export const createDialogAwareScrollRestoration = () => {
  let previousLocationKey: string | undefined
  let dialogReturnLocationKey: string | undefined

  return ({ location }: { location: ParsedLocation }): boolean => {
    const locationKey = location.state.__TSR_key
    const isDialogBackGuard = isDialogBackGuardLocation(location)
    const isReturningFromDialog = !isDialogBackGuard
      && dialogReturnLocationKey !== undefined
      && locationKey === dialogReturnLocationKey

    if (isDialogBackGuard) dialogReturnLocationKey ??= previousLocationKey
    else dialogReturnLocationKey = undefined
    previousLocationKey = locationKey

    return !isDialogBackGuard && !isReturningFromDialog
  }
}
