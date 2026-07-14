import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import type { ButtonProps } from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

interface FormDialogActionsProps {
  onCancel: () => void
  onSave: () => void
  onDelete?: () => void
  /** Color applied to the Cancel/Save buttons. Defaults to MUI's button default. */
  color?: ButtonProps["color"]
}

/**
 * Shared button row for simple create/edit form dialogs: an optional Delete
 * button on the left, Cancel/Save on the right.
 *
 * Must be rendered inside `<Dialog.Actions>` directly — `DialogRoot` picks
 * out its title/content/actions slots by matching the exact component type
 * of each direct child, so this can't be `Dialog.Actions` itself.
 */
export const FormDialogActions: FC<FormDialogActionsProps> = ({ onCancel, onSave, onDelete, color }) => (
  <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
    <Box>
      {onDelete && (
        <Button color="error" onClick={onDelete}>
          Delete
        </Button>
      )}
    </Box>

    <Box>
      <Button color={color} onClick={onCancel}>Cancel</Button>
      <Button variant="contained" color={color} onClick={onSave}>
        Save
      </Button>
    </Box>
  </Stack>
)
