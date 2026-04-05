import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useBuilderSkillsBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useBuildPointsApi.ts"
import {
  ActiveSkillGroupsListItem,
} from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillGroupsListItem.tsx"
import {
  ActiveSkillsListItem,
} from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillsListItem.tsx"
import {
  getDisabledGroups,
  getDisabledSkills,
} from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillsUtils.ts"
import {
  ActiveSkillDialog,
} from "#/components/characterBuilder/sections/skills/activeSkills/dialogs/activeSkillDialog.tsx"
import {
  ActiveSkillGroupDialog,
} from "#/components/characterBuilder/sections/skills/activeSkills/dialogs/activeSkillGroupDialog.tsx"
import { useSkillsStore } from "#/components/skills/useSkillsStore.ts"
import type { ActiveSkillData, SkillGroupData } from "#/lib/system/skillData.ts"

type DialogState =
  | null
  | { type: "activeSkill", skill?: ActiveSkillData, open: boolean }
  | { type: "skillGroup", group?: SkillGroupData, open: boolean }

export const ActiveSkillsList: FC = () => {
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const skillsBuildPoints = useBuilderSkillsBuildPoints()
  const skillsStore = useSkillsStore()
  const activeSkills = useStore(skillsStore, (state) => state.activeSkills)
  const skillGroups = useStore(skillsStore, (state) => state.skillGroups)

  const editingSkillName = dialogState?.type === "activeSkill" ? dialogState.skill?.name : undefined
  const disabledSkills = getDisabledSkills(activeSkills, skillGroups, editingSkillName)

  const editingGroupName = dialogState?.type === "skillGroup" ? dialogState.group?.name : undefined
  const disabledGroups = getDisabledGroups(skillGroups, editingGroupName)

  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })
  const clearDialog = () => setDialogState(null)

  return (
    <Stack gap={1}>
      <Typography variant="body2" color="secondary.main">
        {skillsBuildPoints.activeSkills.bpSpent} BP
      </Typography>

      {activeSkills.length > 0 && (
        <Stack gap={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Active Skills
            </Typography>
          </Stack>
          {activeSkills.map((skill) => (
            <ActiveSkillsListItem
              key={skill.name}
              skill={skill}
              onEdit={() => setDialogState({ type: "activeSkill", skill, open: true })}
              onDelete={() => skillsStore.activeSkills.remove(skill.name)}
            />
          ))}
        </Stack>
      )}

      {skillGroups.length > 0 && (
        <Stack gap={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Active Skill Groups
            </Typography>
          </Stack>

          {skillGroups.map((group) => (
            <ActiveSkillGroupsListItem
              key={group.name}
              group={group}
              onEdit={() => setDialogState({ type: "skillGroup", group, open: true })}
              onDelete={() => skillsStore.skillGroups.remove(group.name)}
            />
          ))}
        </Stack>
      )}

      {activeSkills.length === 0 && skillGroups.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No active skills added
        </Typography>
      )}

      <Stack direction="row" gap={1}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setDialogState({ type: "activeSkill", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Skill
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setDialogState({ type: "skillGroup", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Group
        </Button>
      </Stack>

      {dialogState?.type === "activeSkill" && (
        <ActiveSkillDialog
          open={dialogState.open}
          disabledSkills={disabledSkills}
          skill={dialogState.skill}
          onSave={(skill) => {
            const skillName = dialogState.skill?.name || skill.name
            skillsStore.activeSkills.setState(skillName, () => skill)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}

      {dialogState?.type === "skillGroup" && (
        <ActiveSkillGroupDialog
          open={dialogState.open}
          group={dialogState.group}
          disabledGroups={disabledGroups}
          onSave={(group) => {
            const groupName = dialogState.group?.name || group.name
            skillsStore.skillGroups.setState(groupName, () => group)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}
    </Stack>
  )
}
