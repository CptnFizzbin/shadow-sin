import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { CharacterSheet } from "#/system/characterSheet.ts"

type ImportConflictChoice = "overwrite" | "create-new" | "cancel"

interface ImportConflictDialogProps extends ControlledDialogProps<ImportConflictChoice> {
  incomingCharacter: CharacterSheet
  existingCharacter: CharacterSheet
}

const ImportConflictDialog: FC<ImportConflictDialogProps> = ({
  ctrl,
  incomingCharacter,
  existingCharacter,
}) => {
  return (
    <ControlledDialog ctrl={ctrl} onClose={() => ctrl.close("cancel")}>
      <Dialog.Title>Character already exists</Dialog.Title>
      <Dialog.Content>
        <Typography gutterBottom>
          A character named{" "}
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            {existingCharacter.profile.alias}
          </Typography>{" "}
          with this ID already exists in your roster.
        </Typography>
        <Typography>
          Would you like to overwrite the existing character, or import{" "}
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            {incomingCharacter.profile.alias}
          </Typography>{" "}
          as a new character?
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
  incomingCharacter: CharacterSheet
  existingCharacter: CharacterSheet
}

export const useImportConflictDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseImportConflictDialogProps) => dialogApi.open<ImportConflictChoice>(
      (ctrl) => (
        <ImportConflictDialog
          ctrl={ctrl}
          incomingCharacter={props.incomingCharacter}
          existingCharacter={props.existingCharacter}
        />
      ),
    ),
  }
}
