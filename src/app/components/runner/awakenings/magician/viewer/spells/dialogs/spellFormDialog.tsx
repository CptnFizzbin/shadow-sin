import type { FC } from "react"

import { SpellFormFields } from "#app/components/runner/awakenings/magician/viewer/spells/form/spellFormFields.tsx"
import type { SpellData } from "#data/magic/spellData.ts"
import type { ControlledDialogProps } from "#forms/dialog/controlledDialogProps.ts"
import { FormDialog } from "#forms/dialog/formDialog.tsx"
import { useDialog } from "#forms/dialog/useDialog.tsx"
import { useSpellForm } from "#forms/magician/spells/useSpellForm.ts"

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
    <FormDialog
      ctrl={ctrl}
      title={title}
      onClosed={() => form.reset()}
      onDelete={onDelete}
      onSubmit={() => form.handleSubmit()}
    >
      <SpellFormFields form={form} />
    </FormDialog>
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
