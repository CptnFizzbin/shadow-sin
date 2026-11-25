/**
 * App-wide count of currently-open dialogs/overlays (`DialogCtrl`-backed dialogs,
 * the dice tray, ...). Lets gesture handlers like `SwipeSurface` check "is
 * anything open right now" without needing a dedicated context wired through
 * every route.
 */
let openCount = 0

export function markOverlayOpened(): void {
  openCount++
}

export function markOverlayClosed(): void {
  openCount = Math.max(0, openCount - 1)
}

export function isAnyOverlayOpen(): boolean {
  return openCount > 0
}
