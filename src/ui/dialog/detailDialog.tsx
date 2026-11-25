import Button from "@mui/material/Button"
import type { ReactNode } from "react"

import type { ControlledDialogProps } from "./controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "./dialog.tsx"

export interface DetailDialogProps extends ControlledDialogProps<void> {
  title: ReactNode
  /** Render divider lines around the content area. */
  dividers?: boolean
  children: ReactNode
}

/**
 * Shared shell for read-only detail dialogs: a title, scrollable content,
 * and a single "Close" action. For editable forms use `FormDialog` (small
 * single-record forms) or `ItemDialog` (gear items) instead.
 */
export const DetailDialog = ({ ctrl, title, dividers, children }: DetailDialogProps) => (
  <ControlledDialog ctrl={ctrl} maxWidth="sm">
    <Dialog.Title>{title}</Dialog.Title>
    <Dialog.Content dividers={dividers}>{children}</Dialog.Content>
    <Dialog.Actions>
      <Button onClick={() => ctrl.close()}>Close</Button>
    </Dialog.Actions>
  </ControlledDialog>
)
