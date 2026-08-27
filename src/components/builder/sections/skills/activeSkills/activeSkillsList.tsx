import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useActiveSkillDialog } from "#/components/runner/skills/activeSkills/dialogs/activeSkillFormDialog.tsx"
import {
  useActiveSkillGroupDialog,
} from "#/components/runner/skills/activeSkills/dialogs/activeSkillGroupFormDialog.tsx"
import { EditorMode } from "#/contexts/builder/editorMode.tsx"
import { useBuilderSkillsBuildPoints } from "#/hooks/builder/buildPoints/useBuildPointsApi.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import type { SkillGroupData } from "#/system/skills/skillGroupData"

import {
  ActiveSkillGroupsListItem,
} from "./activeSkillGroupsListItem.tsx"
import { ActiveSkillsListItem } from "./activeSkillsListItem.tsx"
import {
  getDisabledGroups,
  getDisabledSkills,
} from "./activeSkillsUtils.ts"

export const ActiveSkillsList: FC = () => {
  const skillsBuildPoints = useBuilderSkillsBuildPoints()
  const dispatch = useRunnerStoreDispatch()
  const activeSkills = useRunnerSelector(SkillsSelectors.selectActiveSkills)
  const skillGroups = useRunnerSelector(SkillsSelectors.selectSkillGroups)

  const activeSkillDialog = useActiveSkillDialog()
  const activeSkillGroupDialog = useActiveSkillGroupDialog()

  const openActiveSkillDialog = async (skill?: ActiveSkillData) => {
    const disabledSkills = getDisabledSkills(activeSkills, skillGroups, skill?.name)
    const saved = await activeSkillDialog.open({ skill, disabledSkills })
    if (!saved) return
    dispatch(Actions.skills.setActiveSkill(saved))
  }

  const openSkillGroupDialog = async (group?: SkillGroupData) => {
    const disabledGroups = getDisabledGroups(skillGroups, group?.name)
    const saved = await activeSkillGroupDialog.open({ group, disabledGroups })
    if (!saved) return
    dispatch(Actions.skills.setSkillGroup(saved))
  }

  return (
    <Stack>
      <EditorMode.IsBuilder>
        <Typography color="secondary.main">
          {skillsBuildPoints.activeSkills.bpSpent} BP
        </Typography>
      </EditorMode.IsBuilder>

      {activeSkills.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.secondary">
              Active Skills
            </Typography>
          </Stack>
          {activeSkills.map((skill) => (
            <ActiveSkillsListItem
              key={skill.name}
              skill={skill}
              onEdit={() => openActiveSkillDialog(skill)}
              onDelete={() => dispatch(Actions.skills.removeActiveSkill(skill.name))}
            />
          ))}
        </Stack>
      )}

      {skillGroups.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.secondary">
              Active Skill Groups
            </Typography>
          </Stack>

          {skillGroups.map((group) => (
            <ActiveSkillGroupsListItem
              key={group.name}
              group={group}
              onEdit={() => openSkillGroupDialog(group)}
              onDelete={() => dispatch(Actions.skills.removeSkillGroup(group.name))}
            />
          ))}
        </Stack>
      )}

      {activeSkills.length === 0 && skillGroups.length === 0 && (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No active skills added
        </Typography>
      )}

      <Stack direction="row">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => openActiveSkillDialog()}
          sx={{ flexGrow: 1 }}
        >
          Add Skill
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => openSkillGroupDialog()}
          sx={{ flexGrow: 1 }}
        >
          Add Group
        </Button>
      </Stack>

      {activeSkillDialog.outlet}
      {activeSkillGroupDialog.outlet}
    </Stack>
  )
}
