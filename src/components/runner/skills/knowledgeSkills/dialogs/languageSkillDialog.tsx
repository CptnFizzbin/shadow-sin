import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import {
  LanguageSkillFormFields,
} from "#/components/runner/skills/knowledgeSkills/forms/languageSkillFormFields.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useLanguageSkillForm } from "#/lib/hooks/runner/skills/knowledgeSkills/forms/useLanguageSkillForm.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
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
            <Button color="secondary" onClick={() => ctrl.close()}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => form.handleSubmit()}
            >
              Save
            </Button>
          </Box>
        </Stack>
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
