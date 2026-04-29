import MuiDialogActions from "@mui/material/DialogActions"
import type { FC, ReactNode } from "react"

interface DialogActionsProps {
  children: ReactNode
}

export const DialogActions: FC<DialogActionsProps> = ({ children }) => (
  <MuiDialogActions>{children}</MuiDialogActions>
)

DialogActions.displayName = "Dialog.Actions"
