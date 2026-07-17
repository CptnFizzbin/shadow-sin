import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SpellFormFields } from "#/components/runner/magician/spells/form/spellFormFields.tsx"
import { useSpellForm } from "#/components/runner/magician/spells/form/useSpellForm.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

interface SpellFormDialogProps extends ControlledDialogProps<SpellData> {
  spell?: SpellData
  onDelete?: () => void
}

const SpellFormDialog: FC<SpellFormDialogProps> = ({
  ctrl,
  spell,
  onDelete,
}) => {
  const title = spell ? "Edit Spell" : "Add Spell"

  const form = useSpellForm({
    spell,
    onSubmit: (nextSpell: SpellData) => ctrl.close(nextSpell),
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false} onClosed={() => form.reset()}>
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
                  ctrl.close()
                }}
              >
                Delete
              </Button>
            )}
          </Box>

          <Box>
            <Button onClick={() => ctrl.close()}>Cancel</Button>
            <Button variant="contained" onClick={() => form.handleSubmit()}>
              Save
            </Button>
          </Box>
        </Stack>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseSpellFormDialogProps {
  spell?: SpellData
  onDelete?: () => void
}

export const useSpellFormDialog = () => useDialog<SpellData, UseSpellFormDialogProps | undefined>(
  (ctrl, props) => (
    <SpellFormDialog
      ctrl={ctrl}
      spell={props?.spell}
      onDelete={props?.onDelete}
    />
  ),
)
