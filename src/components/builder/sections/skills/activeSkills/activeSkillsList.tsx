import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useBuilderSkillsBuildPoints } from "#/components/builder/buildPoints/hooks/useBuildPointsApi.ts"
import {
  ActiveSkillGroupsListItem,
} from "#/components/builder/sections/skills/activeSkills/activeSkillGroupsListItem.tsx"
import { ActiveSkillsListItem } from "#/components/builder/sections/skills/activeSkills/activeSkillsListItem.tsx"
import {
  getDisabledGroups,
  getDisabledSkills,
} from "#/components/builder/sections/skills/activeSkills/activeSkillsUtils.ts"
import { useActiveSkillDialog } from "#/components/character/skills/activeSkills/dialogs/activeSkillFormDialog.tsx"
import {
  useActiveSkillGroupDialog,
} from "#/components/character/skills/activeSkills/dialogs/activeSkillGroupFormDialog.tsx"
import { selectActiveSkills, selectSkillGroups } from "#/components/character/skills/skillsSelectors.ts"
import { useSkillsStore } from "#/components/character/skills/useSkillsStore.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import type { SkillGroupData } from "#/system/skills/skillGroupData"

export const ActiveSkillsList: FC = () => {
  const skillsBuildPoints = useBuilderSkillsBuildPoints()
  const skillsStore = useSkillsStore()
  const activeSkills = useSelector(skillsStore, selectActiveSkills)
  const skillGroups = useSelector(skillsStore, selectSkillGroups)

  const activeSkillDialog = useActiveSkillDialog()
  const activeSkillGroupDialog = useActiveSkillGroupDialog()

  const openActiveSkillDialog = async (skill?: ActiveSkillData) => {
    const disabledSkills = getDisabledSkills(activeSkills, skillGroups, skill?.name)
    const saved = await activeSkillDialog.open({ skill, disabledSkills }).result()
    if (!saved) return
    const skillName = skill?.name || saved.name
    skillsStore.activeSkills.setState(skillName, () => saved)
  }

  const openSkillGroupDialog = async (group?: SkillGroupData) => {
    const disabledGroups = getDisabledGroups(skillGroups, group?.name)
    const saved = await activeSkillGroupDialog.open({ group, disabledGroups }).result()
    if (!saved) return
    const groupName = group?.name || saved.name
    skillsStore.skillGroups.setState(groupName, () => saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography color="secondary.main">
        {skillsBuildPoints.activeSkills.bpSpent} BP
      </Typography>

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
              onDelete={() => skillsStore.activeSkills.remove(skill.name)}
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
              onDelete={() => skillsStore.skillGroups.remove(group.name)}
            />
          ))}
        </Stack>
      )}

      {activeSkills.length === 0 && skillGroups.length === 0 && (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No active skills added
        </Typography>
      )}

      <Stack direction="row" sx={{ gap: 1 }}>
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
    </Stack>
  )
}
