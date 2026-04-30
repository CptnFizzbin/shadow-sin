import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import {
  LanguageSkillFormFields,
} from "#/components/character/skills/knowledgeSkills/forms/languageSkillFormFields.tsx"
import {
  useLanguageSkillForm,
} from "#/components/character/skills/knowledgeSkills/forms/useLanguageSkillForm.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { noop } from "#/lib/noop.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

interface LanguageSkillDialogProps {
  open: boolean
  skill?: LanguageSkillData
  onSave: (skill: LanguageSkillData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const LanguageSkillDialog: FC<LanguageSkillDialogProps> = ({
  open,
  skill,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const isEditMode = !!skill

  const form = useLanguageSkillForm({ skill, onSubmit: onSave })

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClosed={() => {
        form.reset()
        onClosed()
      }}
    >
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
                  onClose()
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button color="secondary" onClick={onClose}>
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
    </Dialog>
  )
}

export type UseLanguageSkillDialogProps = Omit<
  LanguageSkillDialogProps,
  "open" | "onSave" | "onClose" | "onClosed"
>

export const useLanguageSkillDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseLanguageSkillDialogProps) => dialogApi.open<LanguageSkillData>(
      (ctrl, open) => (
        <LanguageSkillDialog
          {...props}
          open={open}
          onSave={(skill) => ctrl.close(skill)}
          onClose={() => ctrl.close()}
          onClosed={() => ctrl.onClosed()}
        />
      ),
    ),
  }
}
