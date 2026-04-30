import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { CharacterSheet } from "#/system/characterSheet.ts"

type ImportConflictChoice = "overwrite" | "create-new" | "cancel"

interface ImportConflictDialogProps {
  incomingCharacter: CharacterSheet
  existingCharacter: CharacterSheet
  onChoice: (choice: ImportConflictChoice) => void
  onClosed?: () => void
}

const ImportConflictDialog: FC<ImportConflictDialogProps> = ({
  incomingCharacter,
  existingCharacter,
  onChoice,
  onClosed,
}) => {
  const [open, setOpen] = useState<boolean>(true)

  const handleChoice = (choice: ImportConflictChoice) => {
    onChoice(choice)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => handleChoice("cancel")}
      onClosed={onClosed}
    >
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
          onClick={() => handleChoice("cancel")}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleChoice("create-new")}
        >
          Create new
        </Button>
        <Button
          color="warning"
          variant="contained"
          onClick={() => handleChoice("overwrite")}
        >
          Overwrite
        </Button>
      </Dialog.Actions>
    </Dialog>
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
          incomingCharacter={props.incomingCharacter}
          existingCharacter={props.existingCharacter}
          onChoice={(choice) => ctrl.close(choice)}
          onClosed={() => ctrl.onClosed()}
        />
      ),
    ),
  }
}
