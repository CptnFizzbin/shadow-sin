import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import { type FC, useState } from "react"
import { ActiveSkillDialog } from "#/components/Character/Form/Skills/Dialogs/ActiveSkillDialog.tsx"
import { ActiveSkillGroupDialog } from "#/components/Character/Form/Skills/Dialogs/ActiveSkillGroupDialog.tsx"
import { KnowledgeSkillDialog } from "#/components/Character/Form/Skills/Dialogs/KnowledgeSkillDialog.tsx"
import { LanguageSkillDialog } from "#/components/Character/Form/Skills/Dialogs/LanguageSkillDialog.tsx"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  getSkillsInGroup,
  SkillGroupDisplayNames,
} from "#/components/Character/Form/Skills/SkillGroups.ts"
import {
  getActiveSkillBp,
  getActiveSkillGroupBp,
  getKnowledgeSkillSp,
  getLanguageSkillSp,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import { useSkillsFormGroup } from "#/components/Character/Form/Skills/UseSkillsFormGroup.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export interface SkillsFormGroupProps {
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

type KnowledgeSkillDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; skill: KnowledgeSkillFormState; open: boolean }

type LanguageSkillDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; skill: LanguageSkillFormState; open: boolean }

export const SkillsFormGroup: FC<SkillsFormGroupProps> = ({ form }) => {
  const {
    activeSkills,
    activeSkillGroups,
    knowledgeSkills,
    languageSkills,
    totalActiveSkillsBp,
    freeSkillPoints,
    maxSkillPoints,
    totalSpUsed,
    extraSpNeeded,
    extraSpBp,
    activeSkillWarnings,
    knowledgeSkillWarnings,
    addActiveSkill,
    updateActiveSkill,
    removeActiveSkill,
    addActiveSkillGroup,
    updateActiveSkillGroup,
    removeActiveSkillGroup,
    addKnowledgeSkill,
    updateKnowledgeSkill,
    removeKnowledgeSkill,
    addLanguageSkill,
    updateLanguageSkill,
    removeLanguageSkill,
  } = useSkillsFormGroup(form)

  const [activeSkillDialog, setActiveSkillDialog] =
    useState<ActiveSkillDialogState>(null)
  const [activeSkillGroupDialog, setActiveSkillGroupDialog] =
    useState<ActiveSkillGroupDialogState>(null)
  const [knowledgeSkillDialog, setKnowledgeSkillDialog] =
    useState<KnowledgeSkillDialogState>(null)
  const [languageSkillDialog, setLanguageSkillDialog] =
    useState<LanguageSkillDialogState>(null)

  const closeDialog = <TDialogState,>(
    setter: React.Dispatch<React.SetStateAction<TDialogState | null>>,
  ) => {
    setter((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = <TDialogState,>(
    setter: React.Dispatch<React.SetStateAction<TDialogState | null>>,
  ) => {
    setter(null)
  }

  return (
    <Stack gap={2}>
      {/* Active Skills Section */}
      <Stack gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight="bold">
            ══ Active Skills ══
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalActiveSkillsBp} BP
          </Typography>
        </Stack>

        {activeSkillWarnings.map((warning) => (
          <Alert key={warning} severity="warning" sx={{ py: 0 }}>
            {warning}
          </Alert>
        ))}

        {/* Active Skills list */}
        {activeSkills.length > 0 && (
          <Stack gap={0.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ px: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                Active Skills
              </Typography>
              <Typography variant="caption" color="text.secondary">
                4 BP per Rating
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

        {/* Active Skill Groups list */}
        {activeSkillGroups.length > 0 && (
          <Stack gap={0.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ px: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                Active Skill Groups
              </Typography>
              <Typography variant="caption" color="text.secondary">
                10 BP per Rating
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
            size="small"
            startIcon={<RiAddLine size={14} />}
            onClick={() => setActiveSkillDialog({ mode: "create", open: true })}
            sx={{ flexGrow: 1 }}
          >
            Add Skill
          </Button>
          <Button
            variant="outlined"
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
      </Stack>

      <Divider />

      {/* Knowledge & Languages Section */}
      <Stack gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight="bold">
            ══ Knowledge & Languages ══
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2">
            {freeSkillPoints} free skill points
          </Typography>
          <Stack direction="row" gap={1} alignItems="center">
            <Typography
              variant="body2"
              color={
                totalSpUsed > freeSkillPoints
                  ? "warning.main"
                  : "text.secondary"
              }
            >
              {totalSpUsed} SP used
            </Typography>
            {extraSpNeeded > 0 && (
              <Chip
                label={`+${extraSpBp} BP`}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Stack>
        </Stack>

        {totalSpUsed > maxSkillPoints && (
          <Alert severity="error" sx={{ py: 0 }}>
            SP used ({totalSpUsed}) exceeds the maximum ({maxSkillPoints} SP)
          </Alert>
        )}

        {knowledgeSkillWarnings.map((warning) => (
          <Alert key={warning} severity="warning" sx={{ py: 0 }}>
            {warning}
          </Alert>
        ))}

        {/* Knowledge Skills list */}
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
              <Typography variant="caption" color="text.secondary">
                1 SP per Rating
              </Typography>
            </Stack>
            {knowledgeSkills.map((skill) => (
              <KnowledgeSkillRow
                key={skill.id}
                skill={skill}
                onEdit={() =>
                  setKnowledgeSkillDialog({
                    mode: "edit",
                    skill,
                    open: true,
                  })
                }
                onDelete={() => removeKnowledgeSkill(skill.id)}
              />
            ))}
          </Stack>
        )}

        {/* Language Skills list */}
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
              <Typography variant="caption" color="text.secondary">
                1 SP per Rating
              </Typography>
            </Stack>
            {languageSkills.map((skill) => (
              <LanguageSkillRow
                key={skill.id}
                skill={skill}
                onEdit={() =>
                  setLanguageSkillDialog({
                    mode: "edit",
                    skill,
                    open: true,
                  })
                }
                onDelete={() => removeLanguageSkill(skill.id)}
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
            size="small"
            startIcon={<RiAddLine size={14} />}
            onClick={() =>
              setKnowledgeSkillDialog({ mode: "create", open: true })
            }
            sx={{ flexGrow: 1 }}
          >
            Add Knowledge
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RiAddLine size={14} />}
            onClick={() =>
              setLanguageSkillDialog({ mode: "create", open: true })
            }
            sx={{ flexGrow: 1 }}
          >
            Add Language
          </Button>
        </Stack>
      </Stack>

      {/* Active Skill Dialog */}
      {activeSkillDialog?.mode === "create" && (
        <ActiveSkillDialog
          open={activeSkillDialog.open}
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

      {/* Active Skill Group Dialog */}
      {activeSkillGroupDialog?.mode === "create" && (
        <ActiveSkillGroupDialog
          open={activeSkillGroupDialog.open}
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

      {/* Knowledge Skill Dialog */}
      {knowledgeSkillDialog?.mode === "create" && (
        <KnowledgeSkillDialog
          open={knowledgeSkillDialog.open}
          onSave={(skill) => {
            addKnowledgeSkill(skill)
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
            updateKnowledgeSkill(skill)
            closeDialog(setKnowledgeSkillDialog)
          }}
          onDelete={() => {
            removeKnowledgeSkill(knowledgeSkillDialog.skill.id)
            clearDialog(setKnowledgeSkillDialog)
          }}
          onClose={() => closeDialog(setKnowledgeSkillDialog)}
          onClosed={() => clearDialog(setKnowledgeSkillDialog)}
        />
      )}

      {/* Language Skill Dialog */}
      {languageSkillDialog?.mode === "create" && (
        <LanguageSkillDialog
          open={languageSkillDialog.open}
          onSave={(skill) => {
            addLanguageSkill(skill)
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
            updateLanguageSkill(skill)
            closeDialog(setLanguageSkillDialog)
          }}
          onDelete={() => {
            removeLanguageSkill(languageSkillDialog.skill.id)
            clearDialog(setLanguageSkillDialog)
          }}
          onClose={() => closeDialog(setLanguageSkillDialog)}
          onClosed={() => clearDialog(setLanguageSkillDialog)}
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
        <Chip
          label={skill.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
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
      {skill.specialization && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
          [{skill.specialization}]
        </Typography>
      )}
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
          color="text.secondary"
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
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          [{memberSkills.join(", ")}]
        </Typography>
      )}
    </Box>
  )
}

interface KnowledgeSkillRowProps {
  skill: KnowledgeSkillFormState
  onEdit: () => void
  onDelete: () => void
}

const KnowledgeSkillRow: FC<KnowledgeSkillRowProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const spCost = getKnowledgeSkillSp(skill.rating, !!skill.specialization)

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
        <Chip
          label={skill.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {spCost} SP
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
      {skill.specialization && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
          [{skill.specialization}]
        </Typography>
      )}
    </Box>
  )
}

interface LanguageSkillRowProps {
  skill: LanguageSkillFormState
  onEdit: () => void
  onDelete: () => void
}

const LanguageSkillRow: FC<LanguageSkillRowProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const spCost = getLanguageSkillSp(
    skill.isNative,
    skill.rating,
    !!skill.specialization,
  )

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
        ...(skill.isNative && {
          bgcolor: "action.selected",
        }),
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {skill.name}
        </Typography>
        <Chip
          label={skill.isNative ? "N" : skill.rating}
          size="small"
          variant={skill.isNative ? "filled" : "outlined"}
          color={skill.isNative ? "success" : "default"}
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {spCost} SP
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
      {skill.specialization && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
          [{skill.specialization}]
        </Typography>
      )}
    </Box>
  )
}
