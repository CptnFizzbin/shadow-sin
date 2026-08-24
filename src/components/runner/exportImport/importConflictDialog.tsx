import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { RunnerData } from "#/system/runnerData.ts"

type ImportConflictChoice = "overwrite" | "create-new" | "cancel"

interface ImportConflictDialogProps extends ControlledDialogProps<ImportConflictChoice> {
  incomingRunner: RunnerData
  existingRunner: RunnerData
}

const ImportConflictDialog: FC<ImportConflictDialogProps> = ({
  ctrl,
  incomingRunner,
  existingRunner,
}) => {
  return (
    <ControlledDialog ctrl={ctrl} onClose={() => ctrl.close("cancel")}>
      <Dialog.Title>Runner already exists</Dialog.Title>
      <Dialog.Content>
        <Typography gutterBottom>
          A runner named{" "}
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            {existingRunner.profile.alias}
          </Typography>{" "}
          with this ID already exists in your roster.
        </Typography>
        <Typography>
          Would you like to overwrite the existing runner, or import{" "}
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            {incomingRunner.profile.alias}
          </Typography>{" "}
          as a new runner?
        </Typography>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          color="secondary"
          onClick={() => ctrl.close("cancel")}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => ctrl.close("create-new")}
        >
          Create new
        </Button>
        <Button
          color="warning"
          variant="contained"
          onClick={() => ctrl.close("overwrite")}
        >
          Overwrite
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseImportConflictDialogProps {
  incomingRunner: RunnerData
  existingRunner: RunnerData
}

export const useImportConflictDialog = () => useDialog<ImportConflictChoice, UseImportConflictDialogProps>(
  (ctrl, props) => (
    <ImportConflictDialog
      ctrl={ctrl}
      incomingRunner={props.incomingRunner}
      existingRunner={props.existingRunner}
    />
  ),
)
