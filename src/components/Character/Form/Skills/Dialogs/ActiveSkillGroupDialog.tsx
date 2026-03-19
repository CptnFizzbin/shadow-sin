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
import Typography from "@mui/material/Typography"
import { type FC, useState } from "react"
import type { ActiveSkillGroupFormState } from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  getSkillsInGroup,
  SkillGroupDisplayNames,
  SkillGroupNames,
} from "#/components/Character/Form/Skills/SkillGroups.ts"
import { SkillRatingMax } from "#/components/Character/Form/Skills/SkillRequirements.ts"

interface ActiveSkillGroupDialogProps {
  open: boolean
  group?: ActiveSkillGroupFormState
  onSave: (group: ActiveSkillGroupFormState) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const ratingOptions = Array.from({ length: SkillRatingMax }, (_, i) => i + 1)

export const ActiveSkillGroupDialog: FC<ActiveSkillGroupDialogProps> = ({
  open,
  group,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!group

  const [groupName, setGroupName] = useState<string>(group?.groupName ?? "")
  const [rating, setRating] = useState<number>(group?.rating ?? 1)
  const [groupNameError, setGroupNameError] = useState(false)

  const handleSave = () => {
    if (!groupName) {
      setGroupNameError(true)
      return
    }
    onSave({
      id: group?.id ?? crypto.randomUUID(),
      groupName,
      rating,
    })
  }

  const handleClosed = () => {
    setGroupName(group?.groupName ?? "")
    setRating(group?.rating ?? 1)
    setGroupNameError(false)
    onClosed?.()
  }

  const memberSkills = groupName ? getSkillsInGroup(groupName) : []

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onTransitionExited={handleClosed}
    >
      <DialogTitle>
        {isEditMode ? "Edit Skill Group" : "Add Skill Group"}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack gap={2} sx={{ pt: 1 }}>
          <FormControl fullWidth size="small" error={groupNameError}>
            <InputLabel>Skill Group</InputLabel>
            <Select
              value={groupName}
              label="Skill Group"
              onChange={(e) => {
                setGroupName(e.target.value)
                setGroupNameError(false)
              }}
            >
              {SkillGroupNames.map((name) => (
                <MenuItem key={name} value={name}>
                  {SkillGroupDisplayNames[name]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {memberSkills.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              Includes: {memberSkills.join(", ")}
            </Typography>
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
