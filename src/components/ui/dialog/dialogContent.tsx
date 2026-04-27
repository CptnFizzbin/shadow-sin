import type { DialogContentProps as MuiDialogContentProps } from "@mui/material/DialogContent"
import MuiDialogContent from "@mui/material/DialogContent"
import type { FC } from "react"

export type DialogContentProps = MuiDialogContentProps

export const DialogContent: FC<DialogContentProps> = (props) => <MuiDialogContent {...props} />

DialogContent.displayName = "Dialog.Content"
