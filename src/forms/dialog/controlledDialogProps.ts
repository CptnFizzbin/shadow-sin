import type { DialogCtrl } from "./dialogCtrl.ts"

/**
 * Props shared by all controlled dialog components.
 * Extend this instead of declaring your own `open / onClose / onClosed` props.
 *
 * @example
 * ```tsx
 * interface ConfirmDialogProps extends ControlledDialogProps<boolean> {
 *   title?: ReactNode
 *   body: ReactNode
 * }
 * ```
 */
export interface ControlledDialogProps<TReturn = void> {
  ctrl: DialogCtrl<TReturn>
  /**
   * Override the default close-on-backdrop / escape behaviour.
   * - Omit (or `undefined`) — `ctrl.close()` is called (default).
   * - `false` — backdrop / escape key do not close the dialog.
   * - Function — called instead of `ctrl.close()`; useful when you want to
   *   close with a specific value or run side-effects before closing.
   */
  onClose?: false | ((value?: TReturn) => void)
}
