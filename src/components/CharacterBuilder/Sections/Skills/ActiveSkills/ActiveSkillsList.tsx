import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import { useBuilderSkillsBuildPoints } from "#/components/CharacterBuilder/Sections/BuildPoints/useBuildPointsApi.ts"
import {
  ActiveSkillGroupsListItem,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/ActiveSkillGroupsListItem.tsx"
import {
  ActiveSkillsListItem,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/ActiveSkillsListItem.tsx"
import {
  getDisabledGroups,
  getDisabledSkills,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/ActiveSkillsUtils.ts"
import {
  ActiveSkillDialog,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/Dialogs/ActiveSkillDialog.tsx"
import {
  ActiveSkillGroupDialog,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/Dialogs/ActiveSkillGroupDialog.tsx"
import { useSkillsStore } from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsStore.ts"
import type { SkillGroupKey } from "#/lib/system/SkillGroupKey.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import type { ActiveSkillData, SkillGroupData } from "#/lib/system/skillData.ts"

type ActiveSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: ActiveSkillData, open: boolean }

type ActiveSkillGroupDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", group: SkillGroupData, open: boolean }

export const ActiveSkillsList: FC = () => {
  const [activeSkillDialog, setActiveSkillDialog] =
    useState<ActiveSkillDialogState>(null)
  const [activeSkillGroupDialog, setActiveSkillGroupDialog] =
    useState<ActiveSkillGroupDialogState>(null)

  const skillsBuildPoints = useBuilderSkillsBuildPoints()
  const skillsStore = useSkillsStore()
  const activeSkills = useStore(skillsStore, (state) => state.activeSkills)
  const skillGroups = useStore(skillsStore, (state) => state.skillGroups)

  const editingSkillName: SkillKey | null =
    activeSkillDialog?.mode === "edit" ? activeSkillDialog.skill.name : null
  const editingGroupName: SkillGroupKey | null =
    activeSkillGroupDialog?.mode === "edit"
      ? activeSkillGroupDialog.group.name
      : null

  const disabledSkills = getDisabledSkills(activeSkills, skillGroups, editingSkillName)
  const disabledGroups = getDisabledGroups(skillGroups, editingGroupName)

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
              onEdit={() =>
                setActiveSkillDialog({ mode: "edit", skill, open: true })}
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
              onEdit={() =>
                setActiveSkillGroupDialog({ mode: "edit", group, open: true })}
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
          onClick={() => setActiveSkillDialog({ mode: "create", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Skill
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() =>
            setActiveSkillGroupDialog({ mode: "create", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Group
        </Button>
      </Stack>

      {activeSkillDialog?.mode === "create" && (
        <ActiveSkillDialog
          open={activeSkillDialog.open}
          disabledSkills={disabledSkills}
          onSave={(skill) => {
            skillsStore.activeSkills.setState(skill.name, skill)
            closeDialog(setActiveSkillDialog)
          }}
          onClose={() => closeDialog(setActiveSkillDialog)}
          onClosed={() => clearDialog(setActiveSkillDialog)}
        />
      )}

      {activeSkillDialog?.mode === "edit" && (
        <ActiveSkillDialog
          open={activeSkillDialog.open}
          skill={activeSkillDialog.skill}
          disabledSkills={disabledSkills}
          onSave={(skill) => {
            skillsStore.activeSkills.setState(skill.name, skill)
            closeDialog(setActiveSkillDialog)
          }}
          onDelete={() => {
            skillsStore.activeSkills.remove(activeSkillDialog.skill.name)
            clearDialog(setActiveSkillDialog)
          }}
          onClose={() => closeDialog(setActiveSkillDialog)}
          onClosed={() => clearDialog(setActiveSkillDialog)}
        />
      )}

      {activeSkillGroupDialog?.mode === "create" && (
        <ActiveSkillGroupDialog
          open={activeSkillGroupDialog.open}
          disabledGroups={disabledGroups}
          onSave={(group) => {
            skillsStore.skillGroups.setState(group.name, group)
            closeDialog(setActiveSkillGroupDialog)
          }}
          onClose={() => closeDialog(setActiveSkillGroupDialog)}
          onClosed={() => clearDialog(setActiveSkillGroupDialog)}
        />
      )}

      {activeSkillGroupDialog?.mode === "edit" && (
        <ActiveSkillGroupDialog
          open={activeSkillGroupDialog.open}
          group={activeSkillGroupDialog.group}
          disabledGroups={disabledGroups}
          onSave={(group) => {
            skillsStore.skillGroups.setState(group.name, group)
            closeDialog(setActiveSkillGroupDialog)
          }}
          onDelete={() => {
            skillsStore.skillGroups.remove(activeSkillGroupDialog.group.name)
            clearDialog(setActiveSkillGroupDialog)
          }}
          onClose={() => closeDialog(setActiveSkillGroupDialog)}
          onClosed={() => clearDialog(setActiveSkillGroupDialog)}
        />
      )}
    </Stack>
  )
}
