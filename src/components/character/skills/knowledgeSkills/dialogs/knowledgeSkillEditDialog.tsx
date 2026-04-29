import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"
import { SkillRatingMax } from "#/system/skills/skillUtils.ts"

interface KnowledgeSkillEditDialogProps {
  open: boolean
  skill?: KnowledgeSkillData
  onSave: (skill: KnowledgeSkillData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const ratingOptions = Array.from({ length: SkillRatingMax }, (_, i) => i + 1)

export const KnowledgeSkillEditDialog: FC<KnowledgeSkillEditDialogProps> = ({
  open,
  skill,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!skill

  const [name, setName] = useState<string>(skill?.name ?? "")
  const [rating, setRating] = useState<number>(skill?.rating ?? 1)
  const [specialization, setSpecialization] = useState<string>(
    skill?.specialization ?? "",
  )
  const [nameError, setNameError] = useState(false)

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    onSave({
      name: name.trim(),
      rating,
      specialization: specialization.trim() || undefined,
    })
  }

  const handleClosed = () => {
    setName(skill?.name ?? "")
    setRating(skill?.rating ?? 1)
    setSpecialization(skill?.specialization ?? "")
    setNameError(false)
    onClosed?.()
  }

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClosed={handleClosed}
    >
      <Dialog.Title>
        {isEditMode ? "Edit Knowledge Skill" : "Add Knowledge Skill"}
      </Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <TextField
            label="Skill Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(false)
            }}
            error={nameError}
            helperText={nameError ? "Name is required" : ""}
            size="small"
            fullWidth
            autoFocus
          />

          <FormControl fullWidth size="small">
            <InputLabel>Rating</InputLabel>
            <Select
              value={rating}
              label="Rating"
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {ratingOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Specialization (optional)"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            size="small"
            fullWidth
            helperText="Costs 1 SP"
          />
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box>
            {onDelete && (
              <Button
                color="error"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Stack>
      </Dialog.Actions>
    </Dialog>
  )
}

export type UseKnowledgeSkillDialogProps = Omit<
  KnowledgeSkillEditDialogProps,
  "open" | "onSave" | "onClose" | "onClosed"
>

export const useKnowledgeSkillDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseKnowledgeSkillDialogProps) => dialogApi.open<KnowledgeSkillData>(
      (dialogProps) => (
        <KnowledgeSkillEditDialog
          {...props}
          open={dialogProps.open}
          onSave={(skill) => dialogProps.onClose(skill)}
          onClose={() => dialogProps.onClose()}
          onClosed={dialogProps.onClosed}
        />
      ),
    ),
  }
}
