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

import { KnowledgeSkillDialog } from "#/components/Character/Form/Skills/Dialogs/KnowledgeSkillDialog.tsx"
import { LanguageSkillDialog } from "#/components/Character/Form/Skills/Dialogs/LanguageSkillDialog.tsx"
import type {
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  getKnowledgeSkillSp,
  getLanguageSkillSp,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import { useKnowledgeSkillsFormGroup } from "#/components/Character/Form/Skills/UseKnowledgeSkillsFormGroup.ts"
import { Label } from "#/components/UI/Text/Label.tsx"

type KnowledgeSkillDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; skill: KnowledgeSkillFormState; open: boolean }

type LanguageSkillDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; skill: LanguageSkillFormState; open: boolean }

export const KnowledgeSkillsFormGroup: FC = () => {
  const {
    knowledgeSkills,
    languageSkills,
    freeSkillPoints,
    maxSkillPoints,
    totalSpUsed,
    extraSpBp,
    knowledgeSkillWarnings,
    addKnowledgeSkill,
    updateKnowledgeSkill,
    removeKnowledgeSkill,
    addLanguageSkill,
    updateLanguageSkill,
    removeLanguageSkill,
  } = useKnowledgeSkillsFormGroup()

  const [knowledgeSkillDialog, setKnowledgeSkillDialog] =
    useState<KnowledgeSkillDialogState>(null)
  const [languageSkillDialog, setLanguageSkillDialog] =
    useState<LanguageSkillDialogState>(null)

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

  const remainingFreeSp = Math.max(freeSkillPoints - totalSpUsed, 0)

  return (
    <Stack gap={1}>
      <Label label="Knowledge & Languages" variant={"outlined"} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color={"warning.main"}>
          {totalSpUsed} SP
        </Typography>

        <Typography variant="body2" color={"text.secondary"}>
          {remainingFreeSp > 0 && `${remainingFreeSp} free SP remaining`}
        </Typography>

        <Typography variant="body2" color={"secondary.main"}>
          {extraSpBp} BP
        </Typography>
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
          color="secondary"
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
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setLanguageSkillDialog({ mode: "create", open: true })}
          sx={{ flexGrow: 1 }}
        >
          Add Language
        </Button>
      </Stack>

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
          color="warning.main"
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
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {skill.name}
        </Typography>

        {skill.specialization && (
          <Typography variant="caption" color="text.secondary">
            Lingo: {skill.specialization}
          </Typography>
        )}

        <Chip
          label={skill.isNative ? "N" : skill.rating}
          size="small"
          variant={skill.isNative ? "filled" : "outlined"}
          color={skill.isNative ? "success" : "default"}
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="warning.main"
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
    </Box>
  )
}
