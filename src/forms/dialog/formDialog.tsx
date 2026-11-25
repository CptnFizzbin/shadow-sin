import Box from "@mui/material/Box"
import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { ReactNode } from "react"

import type { ControlledDialogProps } from "./controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "./dialog.tsx"

export interface FormDialogProps<TReturn> extends ControlledDialogProps<TReturn> {
  title: ReactNode
  /** Called after the exit animation completes (e.g. to reset form state). */
  onClosed?: () => void
  onDelete?: () => void
  onSubmit: () => void
  /** Color for the Cancel/Save action buttons. Defaults to the theme's primary. */
  color?: ButtonProps["color"]
  children: ReactNode
}

/**
 * Shared shell for single-record form dialogs: a title, content, and a
 * Delete (left) / Cancel + Save (right) action row. For gear item forms use
 * `ItemDialog` instead — this is for smaller single-form dialogs (qualities,
 * spells, complex forms, and similar).
 */
export const FormDialog = <TReturn,>({
  ctrl,
  title,
  onClosed,
  onDelete,
  onSubmit,
  color,
  children,
}: FormDialogProps<TReturn>) => (
  <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false} onClosed={onClosed}>
    <Dialog.Title>{title}</Dialog.Title>
    <Dialog.Content>{children}</Dialog.Content>
    <Dialog.Actions>
      <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
        <Box>
          {onDelete && (
            <Button
              color="error"
              onClick={() => {
                onDelete()
                ctrl.close()
              }}
            >
              Delete
            </Button>
          )}
        </Box>

        <Box>
          <Button color={color} onClick={() => ctrl.close()}>
            Cancel
          </Button>
          <Button variant="contained" color={color} onClick={onSubmit}>
            Save
          </Button>
        </Box>
      </Stack>
    </Dialog.Actions>
  </ControlledDialog>
)
