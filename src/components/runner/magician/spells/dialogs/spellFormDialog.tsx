import type { FC } from "react"

import { SpellFormFields } from "#/components/runner/magician/spells/form/spellFormFields.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { FormDialog } from "#/components/ui/dialog/formDialog.tsx"
import { useSpellForm } from "#/lib/hooks/runner/magician/spells/form/useSpellForm.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
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
