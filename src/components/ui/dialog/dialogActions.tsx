import type { DialogActionsProps as MuiDialogActionsProps } from "@mui/material/DialogActions"
import MuiDialogActions from "@mui/material/DialogActions"
import type { FC } from "react"

export type DialogActionsProps = MuiDialogActionsProps

export const DialogActions: FC<DialogActionsProps> = (props) => <MuiDialogActions {...props} />

DialogActions.displayName = "Dialog.Actions"
