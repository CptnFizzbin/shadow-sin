import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import { ActiveSkillGroupsListItem } from "#/components/CharacterBuilder/Skills/ActiveSkillGroupsListItem.tsx"
import { ActiveSkillsListItem } from "#/components/CharacterBuilder/Skills/ActiveSkillsListItem.tsx"
import {
  getDisabledGroups,
  getDisabledSkills,
} from "#/components/CharacterBuilder/Skills/ActiveSkillsUtils.ts"
import { ActiveSkillDialog } from "#/components/CharacterBuilder/Skills/Dialogs/ActiveSkillDialog.tsx"
import { ActiveSkillGroupDialog } from "#/components/CharacterBuilder/Skills/Dialogs/ActiveSkillGroupDialog.tsx"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import { Label } from "#/components/UI/Text/Label.tsx"

type ActiveSkillDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; skill: ActiveSkillFormState; open: boolean }

type ActiveSkillGroupDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; group: ActiveSkillGroupFormState; open: boolean }

interface ActiveSkillsListProps {
  activeSkills: ActiveSkillFormState[]
  activeSkillGroups: ActiveSkillGroupFormState[]
  totalActiveSkillsBp: number
  activeSkillWarnings: string[]
  onAddSkill: (skill: ActiveSkillFormState) => void
  onUpdateSkill: (skill: ActiveSkillFormState) => void
  onRemoveSkill: (skillId: string) => void
  onAddGroup: (group: ActiveSkillGroupFormState) => void
  onUpdateGroup: (group: ActiveSkillGroupFormState) => void
  onRemoveGroup: (groupId: string) => void
}

export const ActiveSkillsList: FC<ActiveSkillsListProps> = ({
  activeSkills,
  activeSkillGroups,
  totalActiveSkillsBp,
  activeSkillWarnings,
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
}) => {
  const [activeSkillDialog, setActiveSkillDialog] =
    useState<ActiveSkillDialogState>(null)
  const [activeSkillGroupDialog, setActiveSkillGroupDialog] =
    useState<ActiveSkillGroupDialogState>(null)

  const editingSkillId =
    activeSkillDialog?.mode === "edit" ? activeSkillDialog.skill.id : null
  const editingGroupId =
    activeSkillGroupDialog?.mode === "edit"
      ? activeSkillGroupDialog.group.id
      : null

  const disabledSkills = getDisabledSkills(
    activeSkills,
    activeSkillGroups,
    editingSkillId,
  )
  const disabledGroups = getDisabledGroups(activeSkillGroups, editingGroupId)

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

  return (
    <Stack gap={1}>
      <Label label="Active Skills" variant={"outlined"} />

      <Typography variant="body2" color={"secondary.main"}>
        {totalActiveSkillsBp} BP
      </Typography>

      {activeSkillWarnings.map((warning) => (
        <Alert key={warning} severity="warning" sx={{ py: 0 }}>
          {warning}
        </Alert>
      ))}

      {activeSkills.length > 0 && (
        <Stack gap={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Active Skills
            </Typography>
          </Stack>
          {activeSkills.map((skill) => (
            <ActiveSkillsListItem
              key={skill.id}
              skill={skill}
              onEdit={() =>
                setActiveSkillDialog({ mode: "edit", skill, open: true })
              }
              onDelete={() => onRemoveSkill(skill.id)}
            />
          ))}
        </Stack>
      )}

      {activeSkillGroups.length > 0 && (
        <Stack gap={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Active Skill Groups
            </Typography>
          </Stack>

          {activeSkillGroups.map((group) => (
            <ActiveSkillGroupsListItem
              key={group.id}
              group={group}
              onEdit={() =>
                setActiveSkillGroupDialog({ mode: "edit", group, open: true })
              }
              onDelete={() => onRemoveGroup(group.id)}
            />
          ))}
        </Stack>
      )}

      {activeSkills.length === 0 && activeSkillGroups.length === 0 && (
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
            setActiveSkillGroupDialog({ mode: "create", open: true })
          }
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
            onAddSkill(skill)
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
            onUpdateSkill(skill)
            closeDialog(setActiveSkillDialog)
          }}
          onDelete={() => {
            onRemoveSkill(activeSkillDialog.skill.id)
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
            onAddGroup(group)
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
            onUpdateGroup(group)
            closeDialog(setActiveSkillGroupDialog)
          }}
          onDelete={() => {
            onRemoveGroup(activeSkillGroupDialog.group.id)
            clearDialog(setActiveSkillGroupDialog)
          }}
          onClose={() => closeDialog(setActiveSkillGroupDialog)}
          onClosed={() => clearDialog(setActiveSkillGroupDialog)}
        />
      )}
    </Stack>
  )
}
