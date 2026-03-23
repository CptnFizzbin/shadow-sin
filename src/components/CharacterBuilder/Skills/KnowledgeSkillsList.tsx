import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import { KnowledgeSkillDialog } from "#/components/CharacterBuilder/Skills/Dialogs/KnowledgeSkillDialog.tsx"
import { LanguageSkillDialog } from "#/components/CharacterBuilder/Skills/Dialogs/LanguageSkillDialog.tsx"
import { KnowledgeSkillsListItem } from "#/components/CharacterBuilder/Skills/KnowledgeSkillsListItem.tsx"
import { LanguageSkillsListItem } from "#/components/CharacterBuilder/Skills/LanguageSkillsListItem.tsx"
import type {
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import { Label } from "#/components/UI/Text/Label.tsx"

type KnowledgeSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: KnowledgeSkillFormState, open: boolean }

type LanguageSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: LanguageSkillFormState, open: boolean }

interface KnowledgeSkillsListProps {
  knowledgeSkills: KnowledgeSkillFormState[]
  languageSkills: LanguageSkillFormState[]
  freeSkillPoints: number
  maxSkillPoints: number
  totalSpUsed: number
  extraSpBp: number
  knowledgeSkillWarnings: string[]
  onAddKnowledgeSkill: (skill: KnowledgeSkillFormState) => void
  onUpdateKnowledgeSkill: (skill: KnowledgeSkillFormState) => void
  onRemoveKnowledgeSkill: (skillId: string) => void
  onAddLanguageSkill: (skill: LanguageSkillFormState) => void
  onUpdateLanguageSkill: (skill: LanguageSkillFormState) => void
  onRemoveLanguageSkill: (skillId: string) => void
}

export const KnowledgeSkillsList: FC<KnowledgeSkillsListProps> = ({
  knowledgeSkills,
  languageSkills,
  freeSkillPoints,
  maxSkillPoints,
  totalSpUsed,
  extraSpBp,
  knowledgeSkillWarnings,
  onAddKnowledgeSkill,
  onUpdateKnowledgeSkill,
  onRemoveKnowledgeSkill,
  onAddLanguageSkill,
  onUpdateLanguageSkill,
  onRemoveLanguageSkill,
}) => {
  const [knowledgeSkillDialog, setKnowledgeSkillDialog] =
    useState<KnowledgeSkillDialogState>(null)
  const [languageSkillDialog, setLanguageSkillDialog] =
    useState<LanguageSkillDialogState>(null)

  const closeDialog = <TDialogState,>(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = <TDialogState,>(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter(null)
  }

  const remainingFreeSp = Math.max(freeSkillPoints - totalSpUsed, 0)

  return (
    <Stack gap={1}>
      <Label label="Knowledge & Languages" variant="outlined" />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="warning.main">
          {totalSpUsed} SP
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {remainingFreeSp > 0 && `${remainingFreeSp} free SP remaining`}
        </Typography>

        <Typography variant="body2" color="secondary.main">
          {extraSpBp} BP
        </Typography>
      </Stack>

      {totalSpUsed > maxSkillPoints && (
        <Alert severity="error" sx={{ py: 0 }}>
          SP used ({totalSpUsed}) exceeds the maximum ({maxSkillPoints} SP)
        </Alert>
      )}

      {knowledgeSkillWarnings.map((warning) => (
        <Alert key={warning} severity="warning" sx={{ py: 0 }}>
          {warning}
        </Alert>
      ))}

      {knowledgeSkills.length > 0 && (
        <Stack gap={0.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              Knowledge Skills
            </Typography>
          </Stack>
          {knowledgeSkills.map((skill) => (
            <KnowledgeSkillsListItem
              key={skill.id}
              skill={skill}
              onEdit={() =>
                setKnowledgeSkillDialog({
                  mode: "edit",
                  skill,
                  open: true,
                })}
              onDelete={() => onRemoveKnowledgeSkill(skill.id)}
            />
          ))}
        </Stack>
      )}

      {languageSkills.length > 0 && (
        <Stack gap={0.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              Languages
            </Typography>
          </Stack>
          {languageSkills.map((skill) => (
            <LanguageSkillsListItem
              key={skill.id}
              skill={skill}
              onEdit={() =>
                setLanguageSkillDialog({
                  mode: "edit",
                  skill,
                  open: true,
                })}
              onDelete={() => onRemoveLanguageSkill(skill.id)}
            />
          ))}
        </Stack>
      )}

      {knowledgeSkills.length === 0 && languageSkills.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No knowledge or language skills added
        </Typography>
      )}

      <Stack direction="row" gap={1}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() =>
            setKnowledgeSkillDialog({ mode: "create", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Knowledge
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setLanguageSkillDialog({ mode: "create", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Language
        </Button>
      </Stack>

      {knowledgeSkillDialog?.mode === "create" && (
        <KnowledgeSkillDialog
          open={knowledgeSkillDialog.open}
          onSave={(skill) => {
            onAddKnowledgeSkill(skill)
            closeDialog(setKnowledgeSkillDialog)
          }}
          onClose={() => closeDialog(setKnowledgeSkillDialog)}
          onClosed={() => clearDialog(setKnowledgeSkillDialog)}
        />
      )}
      {knowledgeSkillDialog?.mode === "edit" && (
        <KnowledgeSkillDialog
          open={knowledgeSkillDialog.open}
          skill={knowledgeSkillDialog.skill}
          onSave={(skill) => {
            onUpdateKnowledgeSkill(skill)
            closeDialog(setKnowledgeSkillDialog)
          }}
          onDelete={() => {
            onRemoveKnowledgeSkill(knowledgeSkillDialog.skill.id)
            clearDialog(setKnowledgeSkillDialog)
          }}
          onClose={() => closeDialog(setKnowledgeSkillDialog)}
          onClosed={() => clearDialog(setKnowledgeSkillDialog)}
        />
      )}

      {languageSkillDialog?.mode === "create" && (
        <LanguageSkillDialog
          open={languageSkillDialog.open}
          onSave={(skill) => {
            onAddLanguageSkill(skill)
            closeDialog(setLanguageSkillDialog)
          }}
          onClose={() => closeDialog(setLanguageSkillDialog)}
          onClosed={() => clearDialog(setLanguageSkillDialog)}
        />
      )}
      {languageSkillDialog?.mode === "edit" && (
        <LanguageSkillDialog
          open={languageSkillDialog.open}
          skill={languageSkillDialog.skill}
          onSave={(skill) => {
            onUpdateLanguageSkill(skill)
            closeDialog(setLanguageSkillDialog)
          }}
          onDelete={() => {
            onRemoveLanguageSkill(languageSkillDialog.skill.id)
            closeDialog(setLanguageSkillDialog)
          }}
          onClose={() => closeDialog(setLanguageSkillDialog)}
          onClosed={() => clearDialog(setLanguageSkillDialog)}
        />
      )}
    </Stack>
  )
}
