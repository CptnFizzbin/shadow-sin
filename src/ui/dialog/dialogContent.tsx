import MuiDialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

interface DialogContentProps {
  children: ReactNode
  /** Render top and bottom divider lines around the content area. */
  dividers?: boolean
}

export const DialogContent: FC<DialogContentProps> = ({ children, dividers }) => {
  if (typeof children === "string") {
    children = <Typography>{children}</Typography>
  }

  return (
    <MuiDialogContent dividers={dividers}>
      {children}
    </MuiDialogContent>
  )
}
