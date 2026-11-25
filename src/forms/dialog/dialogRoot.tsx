import type { DialogProps as MuiDialogProps } from "@mui/material/Dialog"
import MuiDialog from "@mui/material/Dialog"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC, ReactElement, ReactNode } from "react"
import { Children, isValidElement } from "react"

import { DialogActions } from "./dialogActions.tsx"
import { DialogContent } from "./dialogContent.tsx"
import { DialogTitle } from "./dialogTitle.tsx"
import { useCloseOnBrowserBack } from "./useCloseOnBrowserBack.ts"

function isElementType<TProps>(type: FC<TProps>) {
  return (item: ReactNode): item is ReactElement<TProps> => {
    return isValidElement(item) && item.type === type
  }
}

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
  useCloseOnBrowserBack(open, onClose)

  const childArray = Children.toArray(children)

  const title = childArray.find(isElementType(DialogTitle))
  const content = childArray.find(isElementType(DialogContent))
  const actions = childArray.find(isElementType(DialogActions))

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
      slotProps={{
        transition: { onExited: onClosed },
        // MUI's default paper margin is 32px (top/bottom), keep 40px on
        // non-mobile so the dialog never touches the viewport edges.
        paper: fullScreen
          ? undefined
          : { sx: { marginTop: "40px", marginBottom: "40px", maxHeight: "calc(100% - 80px)" } },
      }}
    >
      {/* The Stack must always stretch to the paper's full (possibly capped)
          height so Dialog.Content can shrink and scroll while the title and
          actions stay pinned in view. */}
      <Stack divider={<Divider />} sx={{ gap: 0, flex: 1, minHeight: 0 }}>
        {title}
        {content}
        {actions}
      </Stack>
    </MuiDialog>
  )
}

DialogRoot.displayName = "Dialog"
