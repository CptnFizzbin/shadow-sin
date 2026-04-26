import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

import {
  LanguageSkillFormFields,
} from "#/components/character/skills/knowledgeSkills/forms/languageSkillFormFields.tsx"
import {
  useLanguageSkillForm,
} from "#/components/character/skills/knowledgeSkills/forms/useLanguageSkillForm.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
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

export const LanguageSkillDialog: FC<LanguageSkillDialogProps> = ({
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
      fullWidth
      maxWidth="sm"
      slotProps={{
        transition: {
          onExited: () => {
            form.reset()
            onClosed()
          },
        },
      }}
    >
      <DialogTitle>
        {isEditMode ? "Edit Language Skill" : "Add Language Skill"}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <LanguageSkillFormFields form={form} />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <div>
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
        </div>
        <div>
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
        </div>
      </DialogActions>
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
      (dialogProps) => (
        <LanguageSkillDialog
          {...props}
          open={dialogProps.open}
          onSave={(skill) => dialogProps.onClose(skill)}
          onClose={() => dialogProps.onClose()}
          onClosed={dialogProps.onClosed}
        />
      ),
    ),
  }
}
