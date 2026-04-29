import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { SkillGroupData } from "#/system/skills/skillGroupData"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillGroupRatingMax } from "#/system/skills/skillUtils.ts"

interface ActiveSkillGroupFormDialogProps {
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

export const ActiveSkillGroupFormDialog: FC<ActiveSkillGroupFormDialogProps> = ({
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
      maxWidth="sm"
      onClosed={handleClosed}
    >
      <Dialog.Title>
        {isEditMode ? "Edit Skill Group" : "Add Skill Group"}
      </Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1 }}>
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
            <Typography color="text.secondary">
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

export type UseActiveSkillGroupDialogProps = Omit<
  ActiveSkillGroupFormDialogProps,
  "open" | "onSave" | "onClose" | "onClosed"
>

export const useActiveSkillGroupDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseActiveSkillGroupDialogProps) => dialogApi.open<SkillGroupData>(
      (dialogProps) => (
        <ActiveSkillGroupFormDialog
          {...props}
          open={dialogProps.open}
          onSave={(group) => dialogProps.onClose(group)}
          onClose={() => dialogProps.onClose()}
          onClosed={dialogProps.onClosed}
        />
      ),
    ),
  }
}
