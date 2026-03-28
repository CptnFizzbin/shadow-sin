import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import {
  KnowledgeSkillDialog,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Dialogs/KnowledgeSkillDialog.tsx"
import {
  LanguageSkillDialog,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Dialogs/LanguageSkillDialog.tsx"
import {
  useBuilderKnowledgeSkillsApi,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/UseBuilderKnowledgeSkillsApi.ts"
import {
  KnowledgeSkillsListItem,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/KnowledgeSkillsListItem.tsx"
import {
  LanguageSkillsListItem,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/LanguageSkillsListItem.tsx"
import type {
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/CharacterBuilder/Sections/Skills/SkillFormState.ts"

type KnowledgeSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: KnowledgeSkillFormState, open: boolean }

type LanguageSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: LanguageSkillFormState, open: boolean }

export const KnowledgeSkillsList: FC = () => {
  const {
    knowledgeSkills,
    languageSkills,
    freeSkillPoints,
    totalSpUsed,
    extraSpBp,
    addKnowledgeSkill,
    updateKnowledgeSkill,
    removeKnowledgeSkill,
    addLanguageSkill,
    updateLanguageSkill,
    removeLanguageSkill,
  } = useBuilderKnowledgeSkillsApi()

  const [knowledgeSkillDialog, setKnowledgeSkillDialog] =
    useState<KnowledgeSkillDialogState>(null)
  const [languageSkillDialog, setLanguageSkillDialog] =
    useState<LanguageSkillDialogState>(null)

  const closeDialog = <TDialogState, >(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = <TDialogState, >(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter(null)
  }

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="warning.main">
          {totalSpUsed} / {freeSkillPoints} Free SP
        </Typography>

        <Typography variant="body2" color="secondary.main">
          {extraSpBp} BP
        </Typography>
      </Stack>

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
              onDelete={() => removeKnowledgeSkill(skill.id)}
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
              onDelete={() => removeLanguageSkill(skill.id)}
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
            addKnowledgeSkill(skill)
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
            updateKnowledgeSkill(skill)
            closeDialog(setKnowledgeSkillDialog)
          }}
          onDelete={() => {
            removeKnowledgeSkill(knowledgeSkillDialog.skill.id)
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
            addLanguageSkill(skill)
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
            updateLanguageSkill(skill)
            closeDialog(setLanguageSkillDialog)
          }}
          onDelete={() => {
            removeLanguageSkill(languageSkillDialog.skill.id)
            closeDialog(setLanguageSkillDialog)
          }}
          onClose={() => closeDialog(setLanguageSkillDialog)}
          onClosed={() => clearDialog(setLanguageSkillDialog)}
        />
      )}
    </Stack>
  )
}
