import { useRouter } from "@tanstack/react-router"
import { useEffect, useRef } from "react"

interface GuardState {
  /** Whether a guard entry is currently believed to be on top of history. */
  pushed: boolean
  /** Pending, cancelable pop scheduled by the most recent cleanup. */
  popTimer: ReturnType<typeof setTimeout> | undefined
}

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
  const guardRef = useRef<GuardState>({ pushed: false, popTimer: undefined })

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open || !onCloseRef.current || !router) return

    const guard = guardRef.current

    // A pop scheduled by a just-prior cleanup (see below) is still pending —
    // this setup is the "remount" half of a same-tick unmount/remount (React
    // StrictMode's dev-only double-invoke, or a fast remount elsewhere), not
    // a real close followed by a real reopen. Cancel it instead of letting
    // both run: the guard entry it would pop is still the one already on top
    // of history, so popping it now would be a leftover of the previous
    // instance, not this one.
    if (guard.popTimer !== undefined) {
      clearTimeout(guard.popTimer)
      guard.popTimer = undefined
    }

    if (!guard.pushed) {
      router.history.push(router.history.location.href, { dialogBackGuard: true })
      // TanStack's browser history batches the real pushState onto a
      // microtask (to smooth out rapid calls). Force it to land synchronously
      // so the entry actually exists in real browser history before anything
      // else (e.g. the pop below) can act on it.
      router.history.flush()
      guard.pushed = true
    }

    const unsubscribe = router.history.subscribe(({ action }) => {
      if (guard.pushed && action.type === "BACK") {
        guard.pushed = false
        onCloseRef.current?.()
      }
    })

    return () => {
      unsubscribe()
      // Unlike push/replace, `.back()` triggers a real (asynchronously
      // observed) browser navigation that can't be forced to land
      // synchronously. Popping right here would race a same-tick remount's
      // setup, which pushes its own entry before this pop's navigation has
      // actually happened — leaving an orphaned entry behind. Defer the pop
      // one tick so a same-tick setup (above) can cancel it instead.
      guard.popTimer = setTimeout(() => {
        guard.popTimer = undefined
        if (guard.pushed) {
          guard.pushed = false
          router.history.back()
        }
      }, 0)
    }
  }, [open, router])
}
