import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { CharacterSheet } from "#/system/characterSheet.ts"

export type ImportConflictChoice = "overwrite" | "create-new" | "cancel"

interface ImportConflictDialogProps {
  incomingCharacter: CharacterSheet
  existingCharacter: CharacterSheet
  onChoice: (choice: ImportConflictChoice) => void
  onClosed?: () => void
}

export const ImportConflictDialog: FC<ImportConflictDialogProps> = ({
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
      onTransitionExited={onClosed}
      fullWidth
    >
      <DialogTitle>Character already exists</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions sx={{ padding: 1, gap: 1 }}>
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
      </DialogActions>
    </Dialog>
  )
}
