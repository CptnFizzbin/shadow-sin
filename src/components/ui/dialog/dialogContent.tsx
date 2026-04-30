import MuiDialogContent from "@mui/material/DialogContent"
import Stack from "@mui/material/Stack"
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
      <Stack sx={{ gap: 2, pt: 1 }}>
        {children}
      </Stack>
    </MuiDialogContent>
  )
}

DialogContent.displayName = "Dialog.Content"
