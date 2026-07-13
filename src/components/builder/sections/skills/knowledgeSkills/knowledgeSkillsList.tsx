import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useKnowledgeSkillsBuildPoints } from "#/components/builder/buildPoints/hooks/useKnowledgeSkillsBuildPoints.ts"
import {
  useKnowledgeSkillDialog,
} from "#/components/runner/skills/knowledgeSkills/dialogs/knowledgeSkillEditDialog.tsx"
import { useLanguageSkillDialog } from "#/components/runner/skills/knowledgeSkills/dialogs/languageSkillDialog.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { SkillPoints } from "#/components/ui/skillPoints.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

import {
  useKnowledgeSkillPoints,
} from "./hooks/useKnowledgeSkillPoints.ts"
import {
  KnowledgeSkillsListItem,
} from "./knowledgeSkillsListItem.tsx"
import {
  LanguageSkillsListItem,
} from "./languageSkillsListItem.tsx"

export const KnowledgeSkillsList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const skillPoints = useKnowledgeSkillPoints()
  const buildPoints = useKnowledgeSkillsBuildPoints()

  const knowledgeSkills = useRunnerStoreSelector(Selectors.skills.selectKnowledgeSkills)
  const languageSkills = useRunnerStoreSelector(Selectors.skills.selectLanguageSkills)

  const knowledgeSkillDialog = useKnowledgeSkillDialog()
  const languageSkillDialog = useLanguageSkillDialog()

  const openKnowledgeSkillDialog = async (skill?: KnowledgeSkillData) => {
    const saved = await knowledgeSkillDialog.open({ skill })
    if (!saved) return
    dispatch(Actions.skills.setKnowledgeSkill(saved))
  }

  const openLanguageSkillDialog = async (skill?: LanguageSkillData) => {
    const saved = await languageSkillDialog.open({ skill })
    if (!saved) return
    dispatch(Actions.skills.setLanguageSkill(saved))
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
              onEdit={() => openKnowledgeSkillDialog(skill)}
              onDelete={() => dispatch(Actions.skills.removeKnowledgeSkill(skill.name))}
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
              onEdit={() => openLanguageSkillDialog(skill)}
              onDelete={() => dispatch(Actions.skills.removeLanguageSkill(skill.name))}
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
          onClick={() => openKnowledgeSkillDialog()}
          sx={{ flexGrow: 1 }}
        >
          Add Knowledge
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => openLanguageSkillDialog()}
          sx={{ flexGrow: 1 }}
        >
          Add Language
        </Button>
      </Stack>

      {knowledgeSkillDialog.dialog}
      {languageSkillDialog.dialog}
    </Stack>
  )
}
