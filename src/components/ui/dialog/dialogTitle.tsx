import MuiDialogTitle from "@mui/material/DialogTitle"
import type { FC, ReactNode } from "react"

interface DialogTitleProps {
  children: ReactNode
}

export const DialogTitle: FC<DialogTitleProps> = ({ children }) => (
  <MuiDialogTitle>{children}</MuiDialogTitle>
)

DialogTitle.displayName = "Dialog.Title"
