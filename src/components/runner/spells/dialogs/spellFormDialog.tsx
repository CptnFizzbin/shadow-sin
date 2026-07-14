import type { FC } from "react"

import { SpellFormFields } from "#/components/runner/spells/form/spellFormFields.tsx"
import { useSpellForm } from "#/components/runner/spells/form/useSpellForm.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { FormDialogActions } from "#/components/ui/dialog/formDialogActions.tsx"
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
        <FormDialogActions
          onCancel={() => ctrl.close()}
          onSave={() => form.handleSubmit()}
          onDelete={onDelete && (() => {
            onDelete()
            ctrl.close()
          })}
        />
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
