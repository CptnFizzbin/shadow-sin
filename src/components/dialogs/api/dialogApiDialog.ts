import type { FC } from "react"

/**
 * Props injected by `DialogApi` into every dialog opened with a component type.
 * Your dialog component must accept (and use) all three props so that the API
 * can drive the open/close lifecycle and clean up after the transition.
 *
 * @example
 * ```tsx
 * const MyDialog: FC<DialogApiDialogProps<boolean>> = ({ open, onClose, onClosed }) => (
 *   <Dialog open={open} onClose={() => onClose(false)} slotProps={{ transition: { onExited: onClosed } }}>
 *     …
 *     <Button onClick={() => onClose(true)}>Confirm</Button>
 *   </Dialog>
 * )
 *
 * const ctrl = api.open<boolean>(MyDialog)
 * const confirmed = await ctrl.result()
 * ```
 */
export interface DialogApiDialogProps<TReturn = void> {
  /** Whether the dialog is currently open. Driven by `DialogCtrl.isOpenStore`. */
  open: boolean
  /**
   * Call when the dialog should close. Resolves the promise returned by
   * `ctrl.result()` with the provided value and triggers the close animation.
   */
  onClose: (value?: TReturn) => void
  /**
   * Call after the close animation has finished (MUI `slotProps.transition.onExited`).
   * Removes the dialog from the root outlet so it unmounts cleanly.
   */
  onClosed: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDialog = FC<DialogApiDialogProps<any>>
