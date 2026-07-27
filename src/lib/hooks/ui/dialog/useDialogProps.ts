// fallow-ignore-file unused-file
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"

/**
 * Reactive `{ open, onClose }` for spreading directly onto a raw `Dialog`
 * (`<Dialog {...useDialogProps(ctrl)}>`) — a manual-control alternative to
 * `ControlledDialog`. Add your own `onClosed` after the spread for feature
 * cleanup; override `onClose` after the spread for a non-default close value.
 */
export function useDialogProps(ctrl: AnyDialogCtrl): { open: boolean, onClose: () => void } {
  const open = useSelector(ctrl.store, (state) => state.open)
  return { open, onClose: () => ctrl.close() }
}
