import { useSyncExternalStore } from "react"

import type { AnyDialogCtrl } from "./dialogCtrl.ts"

/**
 * Reactive read of whether `ctrl`'s dialog is open; re-renders the caller when it opens or closes.
 *
 * @param ctrl - the dialog's controller
 * @returns `true` while the dialog is open
 */
export function useIsDialogOpen(ctrl: AnyDialogCtrl): boolean {
  return useSyncExternalStore(ctrl.store.subscribe, () => ctrl.store.getState().open)
}
