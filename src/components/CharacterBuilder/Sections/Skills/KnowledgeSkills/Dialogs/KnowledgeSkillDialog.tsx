import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useId, useState } from "react"

import type { KnowledgeSkillFormState } from "#/components/CharacterBuilder/Sections/Skills/SkillFormState.ts"
import { SkillRatingMax } from "#/components/CharacterBuilder/Sections/Skills/SkillUtils.ts"

interface KnowledgeSkillDialogProps {
  open: boolean
  skill?: KnowledgeSkillFormState
  onSave: (skill: KnowledgeSkillFormState) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const ratingOptions = Array.from({ length: SkillRatingMax }, (_, i) => i + 1)

export const KnowledgeSkillDialog: FC<KnowledgeSkillDialogProps> = ({
  open,
  skill,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!skill
  const ratingLabelId = useId()

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
      id: skill?.id ?? crypto.randomUUID(),
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
      fullWidth
      maxWidth="sm"
      onTransitionExited={handleClosed}
    >
      <DialogTitle>
        {isEditMode ? "Edit Knowledge Skill" : "Add Knowledge Skill"}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack gap={2} sx={{ pt: 1 }}>
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
            <InputLabel id={ratingLabelId}>Rating</InputLabel>
            <Select
              labelId={ratingLabelId}
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
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <div>
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
        </div>
        <div>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
