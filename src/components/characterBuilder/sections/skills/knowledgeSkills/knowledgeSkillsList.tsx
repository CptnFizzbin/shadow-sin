import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import {
  useKnowledgeSkillsBuildPoints,
} from "#/components/characterBuilder/buildPoints/hooks/useKnowledgeSkillsBuildPoints.ts"
import {
  KnowledgeSkillDialog,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/dialogs/knowledgeSkillDialog.tsx"
import {
  LanguageSkillDialog,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/dialogs/languageSkillDialog.tsx"
import {
  useKnowledgeSkillPoints,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/hooks/useKnowledgeSkillPoints.ts"
import {
  KnowledgeSkillsListItem,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/knowledgeSkillsListItem.tsx"
import {
  LanguageSkillsListItem,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/languageSkillsListItem.tsx"
import { selectKnowledgeSkills, selectLanguageSkills } from "#/components/skills/skillsSelectors.ts"
import { useSkillsStore } from "#/components/skills/useSkillsStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { SkillPoints } from "#/components/ui/skillPoints.tsx"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

type DialogState =
  | null
  | { type: "language", skill?: LanguageSkillData, open: boolean }
  | { type: "knowledge", skill?: KnowledgeSkillData, open: boolean }

export const KnowledgeSkillsList: FC = () => {
  const skillsStore = useSkillsStore()
  const skillPoints = useKnowledgeSkillPoints()
  const buildPoints = useKnowledgeSkillsBuildPoints()

  const knowledgeSkills = useStore(skillsStore, selectKnowledgeSkills)
  const languageSkills = useStore(skillsStore, selectLanguageSkills)

  const [dialogState, setDialogState] = useState<DialogState>(null)

  const closeDialog = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = () => {
    setDialogState(null)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack direction="column">
          <Stack direction="row" sx={{ gap: 1, alignItems: "baseline" }}>
            <SkillPoints type="Free" value={skillPoints.spent.free} max={skillPoints.free} />
            +
            <SkillPoints value={skillPoints.spent.extra} />
          </Stack>

          <Typography>Extra SP costs 2 BP each</Typography>
        </Stack>

        <BuildPoints value={buildPoints.spent} />
      </Stack>

      {knowledgeSkills.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", px: 0.5 }}
          >
            <Typography color="text.secondary">
              Knowledge Skills
            </Typography>
          </Stack>

          {knowledgeSkills.map((skill) => (
            <KnowledgeSkillsListItem
              key={skill.name}
              skill={skill}
              onEdit={() => setDialogState({ type: "knowledge", skill, open: true })}
              onDelete={() => skillsStore.knowledgeSkills.remove(skill.name)}
            />
          ))}
        </Stack>
      )}

      {languageSkills.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", px: 0.5 }}
          >
            <Typography color="text.secondary">
              Languages
            </Typography>
          </Stack>

          {languageSkills.map((skill) => (
            <LanguageSkillsListItem
              key={skill.name}
              skill={skill}
              onEdit={() => setDialogState({ type: "language", skill, open: true })}
              onDelete={() => skillsStore.languageSkills.remove(skill.name)}
            />
          ))}
        </Stack>
      )}

      {knowledgeSkills.length === 0 && languageSkills.length === 0 && (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No knowledge or language skills added
        </Typography>
      )}

      <Stack direction="row" sx={{ gap: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setDialogState({ type: "knowledge", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Knowledge
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setDialogState({ type: "language", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Language
        </Button>
      </Stack>

      {dialogState?.type === "knowledge" && (
        <KnowledgeSkillDialog
          open={dialogState.open}
          skill={dialogState.skill}
          onSave={(skill) => {
            const skillName = dialogState.skill?.name || skill.name
            skillsStore.knowledgeSkills.setState(skillName, () => skill)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}

      {dialogState?.type === "language" && (
        <LanguageSkillDialog
          open={dialogState.open}
          skill={dialogState.skill}
          onSave={(skill) => {
            const skillName = dialogState.skill?.name || skill.name
            skillsStore.languageSkills.setState(skillName, () => skill)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}
    </Stack>
  )
}
