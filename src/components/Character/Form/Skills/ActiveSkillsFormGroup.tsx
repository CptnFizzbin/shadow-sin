import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import { ActiveSkillDialog } from "#/components/Character/Form/Skills/Dialogs/ActiveSkillDialog.tsx"
import { ActiveSkillGroupDialog } from "#/components/Character/Form/Skills/Dialogs/ActiveSkillGroupDialog.tsx"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  getSkillsInGroup,
  SkillGroupDisplayNames,
} from "#/components/Character/Form/Skills/SkillGroups.ts"
import {
  getActiveSkillBp,
  getActiveSkillGroupBp,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import { useActiveSkillsFormGroup } from "#/components/Character/Form/Skills/UseActiveSkillsFormGroup.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
import { Label } from "#/components/UI/Text/Label.tsx"

export interface ActiveSkillsFormGroupProps {
  form: PlayerCharacterForm
}

type ActiveSkillDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; skill: ActiveSkillFormState; open: boolean }

type ActiveSkillGroupDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; group: ActiveSkillGroupFormState; open: boolean }

export const ActiveSkillsFormGroup: FC<ActiveSkillsFormGroupProps> = ({
  form,
}) => {
  const {
    activeSkills,
    activeSkillGroups,
    totalActiveSkillsBp,
    activeSkillWarnings,
    addActiveSkill,
    updateActiveSkill,
    removeActiveSkill,
    addActiveSkillGroup,
    updateActiveSkillGroup,
    removeActiveSkillGroup,
  } = useActiveSkillsFormGroup(form)

  const [activeSkillDialog, setActiveSkillDialog] =
    useState<ActiveSkillDialogState>(null)
  const [activeSkillGroupDialog, setActiveSkillGroupDialog] =
    useState<ActiveSkillGroupDialogState>(null)

  // Skills covered by selected groups (every member skill of every selected group)
  const skillsCoveredByGroups = new Set<string>(
    activeSkillGroups.flatMap((group) => getSkillsInGroup(group.groupName)),
  )

  // For the skill dialog: disable skills that are already individually selected
  // (excluding the one being edited) OR whose group is already selected.
  const editingSkillName =
    activeSkillDialog?.mode === "edit" ? activeSkillDialog.skill.name : null
  const disabledSkills = new Set<string>([
    ...activeSkills
      .filter((s) => s.name !== editingSkillName)
      .map((s) => s.name),
    ...skillsCoveredByGroups,
  ])

  // For the group dialog: disable groups that are already selected (excluding
  // the one being edited)
  const editingGroupName =
    activeSkillGroupDialog?.mode === "edit"
      ? activeSkillGroupDialog.group.groupName
      : null

  const disabledGroups = new Set<string>([
    ...activeSkillGroups
      .filter((g) => g.groupName !== editingGroupName)
      .map((g) => g.groupName),
  ])

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
            <ActiveSkillRow
              key={skill.id}
              skill={skill}
              onEdit={() =>
                setActiveSkillDialog({ mode: "edit", skill, open: true })
              }
              onDelete={() => removeActiveSkill(skill.id)}
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
            <ActiveSkillGroupRow
              key={group.id}
              group={group}
              onEdit={() =>
                setActiveSkillGroupDialog({ mode: "edit", group, open: true })
              }
              onDelete={() => removeActiveSkillGroup(group.id)}
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
            addActiveSkill(skill)
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
            updateActiveSkill(skill)
            closeDialog(setActiveSkillDialog)
          }}
          onDelete={() => {
            removeActiveSkill(activeSkillDialog.skill.id)
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
            addActiveSkillGroup(group)
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
            updateActiveSkillGroup(group)
            closeDialog(setActiveSkillGroupDialog)
          }}
          onDelete={() => {
            removeActiveSkillGroup(activeSkillGroupDialog.group.id)
            clearDialog(setActiveSkillGroupDialog)
          }}
          onClose={() => closeDialog(setActiveSkillGroupDialog)}
          onClosed={() => clearDialog(setActiveSkillGroupDialog)}
        />
      )}
    </Stack>
  )
}

interface ActiveSkillRowProps {
  skill: ActiveSkillFormState
  onEdit: () => void
  onDelete: () => void
}

const ActiveSkillRow: FC<ActiveSkillRowProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const bpCost = getActiveSkillBp(skill.rating, !!skill.specialization)

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {skill.name}
        </Typography>

        {skill.specialization && (
          <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
            {skill.specialization}
          </Typography>
        )}

        <Chip
          label={skill.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="secondary.main"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {bpCost} BP
        </Typography>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <RiDeleteBin6Line size={14} />
        </IconButton>
      </Stack>
    </Box>
  )
}

interface ActiveSkillGroupRowProps {
  group: ActiveSkillGroupFormState
  onEdit: () => void
  onDelete: () => void
}

const ActiveSkillGroupRow: FC<ActiveSkillGroupRowProps> = ({
  group,
  onEdit,
  onDelete,
}) => {
  const bpCost = getActiveSkillGroupBp(group.rating)
  const memberSkills = getSkillsInGroup(group.groupName)
  const displayName =
    SkillGroupDisplayNames[
      group.groupName as keyof typeof SkillGroupDisplayNames
    ] ?? group.groupName

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {displayName}
        </Typography>
        <Chip
          label={group.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="secondary.main"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {bpCost} BP
        </Typography>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <RiDeleteBin6Line size={14} />
        </IconButton>
      </Stack>

      {memberSkills.length > 0 && (
        <Typography variant="caption" color="text.secondary">
          {memberSkills.join(", ")}
        </Typography>
      )}
    </Box>
  )
}
