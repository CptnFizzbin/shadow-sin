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
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"
import { useState } from "react"

import type { LanguageSkillFormState } from "#/components/Character/Form/Skills/SkillFormState.ts"
import { SkillRatingMax } from "#/components/Character/Form/Skills/SkillRequirements.ts"

interface LanguageSkillDialogProps {
  open: boolean
  skill?: LanguageSkillFormState
  onSave: (skill: LanguageSkillFormState) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const ratingOptions = Array.from({ length: SkillRatingMax }, (_, i) => i + 1)

export const LanguageSkillDialog: FC<LanguageSkillDialogProps> = ({
  open,
  skill,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!skill

  const [name, setName] = useState<string>(skill?.name ?? "")
  const [isNative, setIsNative] = useState<boolean>(skill?.isNative ?? false)
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
      isNative,
      rating: isNative ? 0 : rating,
      specialization: specialization.trim() || undefined,
    })
  }

  const handleClosed = () => {
    setName(skill?.name ?? "")
    setIsNative(skill?.isNative ?? false)
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
        {isEditMode ? "Edit Language Skill" : "Add Language Skill"}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack gap={2} sx={{ pt: 1 }}>
          <TextField
            label="Language"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(false)
            }}
            error={nameError}
            helperText={nameError ? "Language name is required" : ""}
            size="small"
            fullWidth
            autoFocus
          />

          <Stack direction="row" alignItems="center" gap={2}>
            <ToggleButtonGroup
              value={isNative ? "native" : "learned"}
              exclusive
              onChange={() => setIsNative(!isNative)}
              size="small"
            >
              <ToggleButton value="native">
                {isNative ? "Native" : "Learned"}
              </ToggleButton>
            </ToggleButtonGroup>

            {!isNative && (
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
            )}
          </Stack>

          <TextField
            label="Lingo / Specialization (optional)"
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
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
