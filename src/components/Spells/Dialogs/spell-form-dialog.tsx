import { Stack } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

import { SpellFormFields } from "#/components/Spells/Form/spell-form-fields.tsx"
import { useSpellForm } from "#/components/Spells/Form/use-spell-form.ts"
import { noop } from "#/lib/noop.ts"
import type { SpellData } from "#/lib/system/magic/spell-data.ts"

export interface SpellFormDialogProps {
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
      onTransitionExited={() => {
        form.reset()
        onClosed()
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <SpellFormFields form={form} />
      </DialogContent>
      <DialogActions>
        <Stack justifyContent="space-between" direction="row" width="100%">
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
