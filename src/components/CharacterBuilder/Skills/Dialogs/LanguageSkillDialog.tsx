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
import { useState } from "react"

import type { LanguageSkillFormState } from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import { SkillRatingMax } from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"

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
  // ratingValue is either a number (1..SkillRatingMax) or the string 'native'
  const [ratingValue, setRatingValue] = useState<string | number>(
    skill?.isNative ? "native" : (skill?.rating ?? 1),
  )
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
      isNative: ratingValue === "native",
      rating: ratingValue === "native" ? 0 : Number(ratingValue),
      specialization: specialization.trim() || undefined,
    })
  }

  const handleClosed = () => {
    setName(skill?.name ?? "")
    setRatingValue(skill?.isNative ? "native" : (skill?.rating ?? 1))
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

          <FormControl fullWidth size="small">
            <InputLabel>Rating</InputLabel>
            <Select
              value={ratingValue}
              label="Rating"
              onChange={(e) => setRatingValue(e.target.value)}
            >
              <MenuItem value={"native"}>Native</MenuItem>
              {ratingOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
