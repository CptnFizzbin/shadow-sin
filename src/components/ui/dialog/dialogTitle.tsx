import type { DialogTitleProps as MuiDialogTitleProps } from "@mui/material/DialogTitle"
import MuiDialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

export type DialogTitleProps = MuiDialogTitleProps

export const DialogTitle: FC<DialogTitleProps> = (props) => <MuiDialogTitle {...props} />

DialogTitle.displayName = "Dialog.Title"
