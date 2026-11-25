import type { RouterHistory } from "@tanstack/react-router"
import { useRouter } from "@tanstack/react-router"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import type { DialogHistory } from "#ui/dialog/dialogHistory.tsx"
import { DialogHistoryProvider } from "#ui/dialog/dialogHistory.tsx"

/**
 * Adapts a TanStack Router history to the `DialogHistory` that dialogs use to close on the
 * browser's back button.
 *
 * @param history - the router's history
 * @returns a `DialogHistory` that pushes, pops and observes entries on `history`
 */
const createRouterDialogHistory = (history: RouterHistory): DialogHistory => ({
  push: (state) => {
    history.push(history.location.href, state)
    // TanStack's browser history batches the real pushState onto a microtask (to smooth out
    // rapid calls). Force it to land synchronously so the entry actually exists in real browser
    // history before anything else (e.g. a dialog's deferred pop) can act on it.
    history.flush()
  },
  back: () => history.back(),
  subscribeToBack: (listener) => history.subscribe(({ action }) => {
    if (action.type === "BACK") listener()
  }),
})

/**
 * Lets the dialogs below it close on the browser's back button, through the surrounding
 * router's history. Render it inside a `RouterProvider` (or `RouterContextProvider`).
 */
export const RouterDialogHistoryProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  // Every open dialog's back-button guard re-registers when the adapter's identity changes, so
  // keep it tied to the router's history rather than to each render.
  const dialogHistory = useMemo(() => createRouterDialogHistory(router.history), [router.history])

  return <DialogHistoryProvider history={dialogHistory}>{children}</DialogHistoryProvider>
}
