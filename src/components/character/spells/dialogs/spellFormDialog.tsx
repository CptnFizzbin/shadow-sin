import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SpellFormFields } from "#/components/character/spells/form/spellFormFields.tsx"
import { useSpellForm } from "#/components/character/spells/form/useSpellForm.ts"
import { noop } from "#/lib/noop.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

interface SpellFormDialogProps {
  open: boolean
  spell?: SpellData
  onSave: (spell: SpellData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const SpellFormDialog: FC<SpellFormDialogProps> = ({
  open,
  spell,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const title = spell ? "Edit Spell" : "Add Spell"

  const form = useSpellForm({
    spell,
    onSubmit: (nextSpell: SpellData) => {
      onSave(nextSpell)
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      slotProps={{
        transition: {
          onExited: () => {
            form.reset()
            onClosed()
          },
        },
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <SpellFormFields form={form} />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box>
            {onDelete && (
              <Button
                color="error"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
              >
                Delete
              </Button>
            )}
          </Box>

          <Box>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={() => form.handleSubmit()}>
              Save
            </Button>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
