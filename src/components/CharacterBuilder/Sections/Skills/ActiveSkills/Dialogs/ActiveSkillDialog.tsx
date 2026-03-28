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
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { ActiveSkillFormState } from "#/components/CharacterBuilder/Sections/Skills/SkillFormState.ts"
import { SkillRatingMax } from "#/components/CharacterBuilder/Sections/Skills/SkillUtils.ts"
import { SkillKey, Skills } from "#/lib/system/SkillKey.ts"

interface ActiveSkillDialogProps {
  open: boolean
  skill?: ActiveSkillFormState
  /** Skill names that must be disabled because they are already taken (individually or via a group). */
  disabledSkills?: ReadonlySet<string>
  onSave: (skill: ActiveSkillFormState) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const ratingOptions = Array.from({ length: SkillRatingMax }, (_, i) => i + 1)

const skillOptions = Object.values(SkillKey).sort()

export const ActiveSkillDialog: FC<ActiveSkillDialogProps> = ({
  open,
  skill,
  disabledSkills,
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
    if (!name) {
      setNameError(true)
      return
    }
    onSave({
      id: skill?.id ?? crypto.randomUUID(),
      name,
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

  const linkedAttr = name ? Skills[name as SkillKey]?.attr : undefined

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onTransitionExited={handleClosed}
    >
      <DialogTitle>
        {isEditMode ? "Edit Active Skill" : "Add Active Skill"}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack gap={2} sx={{ pt: 1 }}>
          <FormControl fullWidth size="small" error={nameError}>
            <InputLabel>Skill</InputLabel>
            <Select
              value={name}
              label="Skill"
              onChange={(e) => {
                setName(e.target.value)
                setNameError(false)
              }}
            >
              {skillOptions.map((skillKey) => {
                const isDisabled = disabledSkills?.has(skillKey) ?? false
                return (
                  <MenuItem
                    key={skillKey}
                    value={skillKey}
                    disabled={isDisabled}
                  >
                    <Stack
                      direction="row"
                      gap={1}
                      alignItems="center"
                      justifyContent="space-between"
                      flexGrow={10}
                    >
                      <Typography>{skillKey}</Typography>
                      <Typography color="text.secondary" fontSize="small">
                        {Skills[skillKey]?.group}
                      </Typography>
                    </Stack>
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          {linkedAttr && (
            <TextField
              label="Linked Attribute"
              value={linkedAttr}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
          )}

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
            helperText="Costs 2 BP"
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
