import type { ParsedLocation } from "@tanstack/react-router"

import { isDialogBackGuardState } from "#ui/dialog/dialogBackGuard.ts"

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
    const isDialogBackGuard = isDialogBackGuardState(location.state)
    const isReturningFromDialog = !isDialogBackGuard
      && dialogReturnLocationKey !== undefined
      && locationKey === dialogReturnLocationKey

    if (isDialogBackGuard) dialogReturnLocationKey ??= previousLocationKey
    else dialogReturnLocationKey = undefined
    previousLocationKey = locationKey

    return !isDialogBackGuard && !isReturningFromDialog
  }
}
