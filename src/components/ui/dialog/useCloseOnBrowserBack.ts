import { useRouter } from "@tanstack/react-router"
import { useEffect, useRef } from "react"

/**
 * Pushes a history entry while the dialog is open so that pressing the
 * browser's back button closes it instead of navigating away. The entry is
 * popped again as soon as the dialog closes by any other means (backdrop,
 * Escape, an action button, ...), so it never lingers in history.
 *
 * No-ops when `onClose` is undefined — those dialogs already opt out of
 * backdrop/Escape dismissal, so back-button dismissal is skipped too. Also
 * no-ops outside a `RouterProvider` (e.g. in component tests rendered
 * without a router).
 */
export function useCloseOnBrowserBack(open: boolean, onClose: (() => void) | undefined): void {
  const router = useRouter({ warn: false })
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open || !onCloseRef.current || !router) return

    let guardPushed = true
    router.history.push(router.history.location.href, { dialogBackGuard: true })

    const unsubscribe = router.history.subscribe(({ action }) => {
      if (guardPushed && action.type === "BACK") {
        guardPushed = false
        onCloseRef.current?.()
      }
    })

    return () => {
      unsubscribe()
      if (guardPushed) {
        guardPushed = false
        router.history.back()
      }
    }
  }, [open, router])
}
