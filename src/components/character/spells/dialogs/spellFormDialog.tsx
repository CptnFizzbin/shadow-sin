import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SpellFormFields } from "#/components/character/spells/form/spellFormFields.tsx"
import { useSpellForm } from "#/components/character/spells/form/useSpellForm.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
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

const SpellFormDialog: FC<SpellFormDialogProps> = ({
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
      maxWidth="sm"
      onClosed={() => {
        form.reset()
        onClosed()
      }}
    >
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <SpellFormFields form={form} />
      </Dialog.Content>
      <Dialog.Actions>
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
      </Dialog.Actions>
    </Dialog>
  )
}

interface UseSpellFormDialogProps {
  spell?: SpellData
  onDelete?: () => void
}

export const useSpellFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseSpellFormDialogProps) => dialogApi.open<SpellData>(
      (ctrl, open) => (
        <SpellFormDialog
          open={open}
          spell={props?.spell}
          onDelete={props?.onDelete}
          onSave={(spell) => ctrl.close(spell)}
          onClose={() => ctrl.close()}
          onClosed={() => ctrl.onClosed()}
        />
      ),
    ),
  }
}
