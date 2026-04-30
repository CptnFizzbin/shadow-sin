import type { DialogProps as MuiDialogProps } from "@mui/material/Dialog"
import MuiDialog from "@mui/material/Dialog"
import type { ReactNode } from "react"

/**
 * Props for the compound `Dialog` root.
 *
 * Only functional/behavioural props are exposed — styling is fixed by the
 * component to keep dialogs uniform across the application. Dialogs are always
 * full-width; use `maxWidth` to control the maximum size.
 *
 * See `docs/ui/dialog.md` for usage examples.
 */
export interface DialogRootProps {
  /** Whether the dialog is open. */
  open: boolean
  /** Called when the backdrop is clicked or Escape is pressed. */
  onClose?: () => void
  /** Called after the exit animation completes. */
  onClosed?: () => void
  /** Maximum width breakpoint. Defaults to `"sm"`. */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false
  /** Render the dialog in full-screen mode (useful on narrow viewports). */
  fullScreen?: boolean
  children: ReactNode
}

export const DialogRoot = ({
  open,
  onClose,
  onClosed,
  maxWidth = "sm",
  fullScreen,
  children,
}: DialogRootProps) => {
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

DialogRoot.displayName = "Dialog"
