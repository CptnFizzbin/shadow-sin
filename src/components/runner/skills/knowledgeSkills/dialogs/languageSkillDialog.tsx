import type { FC } from "react"

import {
  LanguageSkillFormFields,
} from "#/components/runner/skills/knowledgeSkills/forms/languageSkillFormFields.tsx"
import { useLanguageSkillForm } from "#/components/runner/skills/knowledgeSkills/forms/useLanguageSkillForm.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { FormDialogActions } from "#/components/ui/dialog/formDialogActions.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

interface LanguageSkillDialogProps extends ControlledDialogProps<LanguageSkillData> {
  skill?: LanguageSkillData
  onDelete?: () => void
}

const LanguageSkillDialog: FC<LanguageSkillDialogProps> = ({
  ctrl,
  skill,
  onDelete,
}) => {
  const isEditMode = !!skill

  const form = useLanguageSkillForm({ skill, onSubmit: (savedSkill) => ctrl.close(savedSkill) })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false} onClosed={() => form.reset()}>
      <Dialog.Title>
        {isEditMode ? "Edit Language Skill" : "Add Language Skill"}
      </Dialog.Title>

      <Dialog.Content>
        <LanguageSkillFormFields form={form} />
      </Dialog.Content>

      <Dialog.Actions>
        <FormDialogActions
          color="secondary"
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

type UseLanguageSkillDialogProps = Omit<
  LanguageSkillDialogProps,
  keyof ControlledDialogProps<LanguageSkillData>
>

export const useLanguageSkillDialog = () => useDialog<LanguageSkillData, UseLanguageSkillDialogProps | undefined>(
  (ctrl, props) => <LanguageSkillDialog ctrl={ctrl} {...props} />,
)
