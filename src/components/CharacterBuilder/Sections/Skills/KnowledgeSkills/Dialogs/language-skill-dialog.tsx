import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

import {
  LanguageSkillFormFields,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Forms/language-skill-form-fields.tsx"
import {
  useLanguageSkillForm,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/use-language-skill-form.ts"
import { noop } from "#/lib/noop.ts"
import type { LanguageSkillData } from "#/lib/system/skill-data.ts"

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
      onTransitionExited={() => {
        form.reset()
        onClosed()
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
