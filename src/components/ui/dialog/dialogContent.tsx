import MuiDialogContent from "@mui/material/DialogContent"
import type { FC, ReactNode } from "react"

interface DialogContentProps {
  children: ReactNode
  /** Render top and bottom divider lines around the content area. */
  dividers?: boolean
}

export const DialogContent: FC<DialogContentProps> = ({ children, dividers }) => (
  <MuiDialogContent dividers={dividers}>{children}</MuiDialogContent>
)

DialogContent.displayName = "Dialog.Content"
