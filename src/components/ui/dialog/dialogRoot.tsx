import type { DialogProps as MuiDialogProps } from "@mui/material/Dialog"
import MuiDialog from "@mui/material/Dialog"
import type { FC, ReactNode } from "react"

import type { DialogApiDialogProps } from "#/components/dialogs/api/dialogApiDialog.ts"

/**
 * Props for the compound `Dialog` root.
 *
 * Only functional/behavioural props are exposed — styling is fixed by the
 * component to keep dialogs uniform across the application. Dialogs are always
 * full-width; use `maxWidth` to control the maximum size.
 *
 * Compatible with {@link DialogApiDialogProps}: spread the props injected by
 * `DialogApi.open(...)` directly onto this component and the `open` / lifecycle
 * wiring is handled automatically.
 *
 * See `docs/ui/dialog.md` for usage examples.
 */
export interface DialogRootProps<TReturn = void> extends Partial<DialogApiDialogProps<TReturn>> {
  /** Whether the dialog is open. */
  open: boolean
  /** Maximum width breakpoint. Defaults to `"sm"`. */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false
  /** Render the dialog in full-screen mode (useful on narrow viewports). */
  fullScreen?: boolean
  children: ReactNode
}

export const DialogRoot = <TReturn = void>({
  open,
  onClose,
  onClosed,
  maxWidth = "sm",
  fullScreen,
  children,
}: DialogRootProps<TReturn>) => {
  const handleClose: MuiDialogProps["onClose"] = () => {
    onClose?.()
  }

  return (
    <MuiDialog
      open={open}
      onClose={onClose ? handleClose : undefined}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen}
      slotProps={{ transition: { onExited: onClosed } }}
    >
      {children}
    </MuiDialog>
  )
}

;(DialogRoot as FC).displayName = "Dialog"
