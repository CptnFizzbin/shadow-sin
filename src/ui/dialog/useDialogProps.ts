// fallow-ignore-file unused-file
import type { AnyDialogCtrl } from "./dialogCtrl.ts"
import { useIsDialogOpen } from "./useIsDialogOpen.ts"

/**
 * Reactive `{ open, onClose }` for spreading directly onto a raw `Dialog`
 * (`<Dialog {...useDialogProps(ctrl)}>`) — a manual-control alternative to
 * `ControlledDialog`. Add your own `onClosed` after the spread for feature
 * cleanup; override `onClose` after the spread for a non-default close value.
 */
export function useDialogProps(ctrl: AnyDialogCtrl): { open: boolean, onClose: () => void } {
  const open = useIsDialogOpen(ctrl)
  return { open, onClose: () => ctrl.close() }
}
