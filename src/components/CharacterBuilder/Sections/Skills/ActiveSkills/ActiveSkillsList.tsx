import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
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
import {
  useBuilderActiveSkillsApi,
  useBuilderSkillGroupsApi,
} from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsApi.ts"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/CharacterBuilder/Sections/Skills/SkillFormState.ts"

type ActiveSkillDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", skill: ActiveSkillFormState, open: boolean }

type ActiveSkillGroupDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", group: ActiveSkillGroupFormState, open: boolean }

export const ActiveSkillsList: FC = () => {
  const [activeSkillDialog, setActiveSkillDialog] =
    useState<ActiveSkillDialogState>(null)
  const [activeSkillGroupDialog, setActiveSkillGroupDialog] =
    useState<ActiveSkillGroupDialogState>(null)

  const skillsBuildPoints = useBuilderSkillsBuildPoints()
  const activeSkillsApi = useBuilderActiveSkillsApi()
  const activeSkillGroupsApi = useBuilderSkillGroupsApi()

  const editingSkillId =
    activeSkillDialog?.mode === "edit" ? activeSkillDialog.skill.id : null
  const editingGroupId =
    activeSkillGroupDialog?.mode === "edit"
      ? activeSkillGroupDialog.group.id
      : null

  const disabledSkills = getDisabledSkills(
    activeSkillsApi.skills,
    activeSkillGroupsApi.skillGroups,
    editingSkillId,
  )
  const disabledGroups = getDisabledGroups(activeSkillGroupsApi.skillGroups, editingGroupId)

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

      {activeSkillsApi.skills.length > 0 && (
        <Stack gap={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Active Skills
            </Typography>
          </Stack>
          {activeSkillsApi.skills.map((skill) => (
            <ActiveSkillsListItem
              key={skill.id}
              skill={skill}
              onEdit={() =>
                setActiveSkillDialog({ mode: "edit", skill, open: true })}
              onDelete={() => activeSkillsApi.removeSkill(skill)}
            />
          ))}
        </Stack>
      )}

      {activeSkillGroupsApi.skillGroups.length > 0 && (
        <Stack gap={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Active Skill Groups
            </Typography>
          </Stack>

          {activeSkillGroupsApi.skillGroups.map((group) => (
            <ActiveSkillGroupsListItem
              key={group.id}
              group={group}
              onEdit={() =>
                setActiveSkillGroupDialog({ mode: "edit", group, open: true })}
              onDelete={() => activeSkillGroupsApi.removeGroup(group)}
            />
          ))}
        </Stack>
      )}

      {activeSkillsApi.skills.length === 0 && activeSkillGroupsApi.skillGroups.length === 0 && (
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
            activeSkillsApi.addSkill(skill)
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
            activeSkillsApi.updateSkill(skill)
            closeDialog(setActiveSkillDialog)
          }}
          onDelete={() => {
            activeSkillsApi.removeSkill(activeSkillDialog.skill)
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
            activeSkillGroupsApi.addGroup(group)
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
            activeSkillGroupsApi.updateGroup(group)
            closeDialog(setActiveSkillGroupDialog)
          }}
          onDelete={() => {
            activeSkillGroupsApi.removeGroup(activeSkillGroupDialog.group)
            clearDialog(setActiveSkillGroupDialog)
          }}
          onClose={() => closeDialog(setActiveSkillGroupDialog)}
          onClosed={() => clearDialog(setActiveSkillGroupDialog)}
        />
      )}
    </Stack>
  )
}
