import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import { useAttr } from "#/components/Character/CharacterUtils.ts"
import { useSkillsStore } from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsStore.ts"
import {
  KnowledgeSkillDialog,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Dialogs/KnowledgeSkillDialog.tsx"
import {
  LanguageSkillDialog,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Dialogs/LanguageSkillDialog.tsx"
import {
  KnowledgeSkillsListItem,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/KnowledgeSkillsListItem.tsx"
import {
  LanguageSkillsListItem,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/LanguageSkillsListItem.tsx"
import {
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/CharacterBuilder/Sections/Skills/SkillUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { KnowledgeSkillData, LanguageSkillData } from "#/lib/system/skillData.ts"

type KnowledgeSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: KnowledgeSkillData, open: boolean }

type LanguageSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: LanguageSkillData, open: boolean }

export const KnowledgeSkillsList: FC = () => {
  const skillsStore = useSkillsStore()

  const logicAttr = useAttr(AttributeKey.logic)
  const intuitionAttr = useAttr(AttributeKey.intuition)

  const knowledgeSkills = useStore(skillsStore, (state) => state.knowledgeSkills)
  const languageSkills = useStore(skillsStore, (state) => state.languageSkills)

  const freeSkillPoints = getFreeSkillPoints(logicAttr, intuitionAttr)
  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(knowledgeSkills, languageSkills)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)

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
              key={skill.name}
              skill={skill}
              onEdit={() => setKnowledgeSkillDialog({ mode: "edit", skill, open: true })}
              onDelete={() => skillsStore.knowledgeSkills.remove(skill.name)}
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
              key={skill.name}
              skill={skill}
              onEdit={() => setLanguageSkillDialog({ mode: "edit", skill, open: true })}
              onDelete={() => skillsStore.languageSkills.remove(skill.name)}
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
          onClick={() => setKnowledgeSkillDialog({ mode: "create", open: true })}
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
            skillsStore.knowledgeSkills.setState(skill.name, skill)
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
            skillsStore.knowledgeSkills.setState(skill.name, skill)
            closeDialog(setKnowledgeSkillDialog)
          }}
          onDelete={() => {
            skillsStore.knowledgeSkills.remove(knowledgeSkillDialog.skill.name)
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
            skillsStore.languageSkills.setState(skill.name, skill)
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
            skillsStore.languageSkills.setState(skill.name, skill)
            closeDialog(setLanguageSkillDialog)
          }}
          onDelete={() => {
            skillsStore.languageSkills.remove(languageSkillDialog.skill.name)
            closeDialog(setLanguageSkillDialog)
          }}
          onClose={() => closeDialog(setLanguageSkillDialog)}
          onClosed={() => clearDialog(setLanguageSkillDialog)}
        />
      )}
    </Stack>
  )
}
