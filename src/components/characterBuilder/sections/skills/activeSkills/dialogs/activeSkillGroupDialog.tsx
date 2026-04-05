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
import type { FC } from "react"
import { useState } from "react"

import { getSkillsInGroup } from "#/components/characterBuilder/sections/skills/activeSkills/skillGroupUtils.ts"
import { SkillGroupRatingMax } from "#/components/characterBuilder/sections/skills/skillsBuilderUtils.ts"
import type { SkillGroupData } from "#/lib/system/skillData.ts"
import { SkillGroupKey } from "#/lib/system/skillGroupKey.ts"

interface ActiveSkillGroupDialogProps {
  open: boolean
  group?: SkillGroupData
  /** Group names that must be disabled because they are already taken or a member skill is already individually selected. */
  disabledGroups?: ReadonlySet<string>
  onSave: (group: SkillGroupData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const ratingOptions = Array.from(
  { length: SkillGroupRatingMax },
  (_, i) => i + 1,
)

export const ActiveSkillGroupDialog: FC<ActiveSkillGroupDialogProps> = ({
  open,
  group,
  disabledGroups,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!group

  const [groupName, setGroupName] = useState<SkillGroupKey | null>(
    group?.name ?? null,
  )
  const [rating, setRating] = useState<number>(group?.rating ?? 1)
  const [groupNameError, setGroupNameError] = useState(false)

  const handleSave = () => {
    if (!groupName) {
      setGroupNameError(true)
      return
    }
    onSave({
      name: groupName,
      rating,
    })
  }

  const handleClosed = () => {
    setGroupName(group?.name ?? null)
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
                const selectedGroupName = e.target.value as SkillGroupKey | ""
                setGroupName(selectedGroupName || null)
                setGroupNameError(false)
              }}
            >
              {Object.values(SkillGroupKey).map((name) => {
                const isDisabled = disabledGroups?.has(name) ?? false
                return (
                  <MenuItem key={name} value={name} disabled={isDisabled}>
                    {name}
                  </MenuItem>
                )
              })}
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
