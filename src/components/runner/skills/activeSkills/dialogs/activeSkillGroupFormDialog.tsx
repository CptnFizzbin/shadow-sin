import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { RatingSelectField } from "#/components/runner/skills/ratingSelectField.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { FormDialogActions } from "#/components/ui/dialog/formDialogActions.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import type { SkillGroupData } from "#/system/skills/skillGroupData"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillGroupRatingMax } from "#/system/skills/skillUtils.ts"

interface ActiveSkillGroupFormDialogProps extends ControlledDialogProps<SkillGroupData> {
  group?: SkillGroupData
  /** Group names that must be disabled because they are already taken or a member skill is already individually selected. */
  disabledGroups?: ReadonlySet<string>
  onDelete?: () => void
}

const ratingOptions = Array.from(
  { length: SkillGroupRatingMax },
  (_, i) => i + 1,
)

const ActiveSkillGroupFormDialog: FC<ActiveSkillGroupFormDialogProps> = ({
  ctrl,
  group,
  disabledGroups,
  onDelete,
}) => {
  const isEditMode = !!group

  // MUI Select requires `""` (not `null`) for the empty state — passing `null`
  // logs an "out-of-range value" warning and flips the underlying input from
  // uncontrolled to controlled the first time the user picks a group.
  const [groupName, setGroupName] = useState<SkillGroupKey | "">(
    group?.name ?? "",
  )
  const [rating, setRating] = useState<number>(group?.rating ?? 1)
  const [groupNameError, setGroupNameError] = useState(false)

  const handleSave = () => {
    if (!groupName) {
      setGroupNameError(true)
      return
    }
    ctrl.close({
      name: groupName,
      rating,
    })
  }

  const handleClosed = () => {
    setGroupName(group?.name ?? "")
    setRating(group?.rating ?? 1)
    setGroupNameError(false)
  }

  const memberSkills = groupName ? getSkillsInGroup(groupName) : []

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false} onClosed={handleClosed}>
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
                setGroupName(e.target.value as SkillGroupKey | "")
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

          <RatingSelectField rating={rating} options={ratingOptions} onChange={setRating} />
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <FormDialogActions
          color="secondary"
          onCancel={() => ctrl.close()}
          onSave={handleSave}
          onDelete={onDelete && (() => {
            onDelete()
            ctrl.close()
          })}
        />
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseActiveSkillGroupDialogProps = Omit<
  ActiveSkillGroupFormDialogProps,
  keyof ControlledDialogProps<SkillGroupData>
>

export const useActiveSkillGroupDialog = () => useDialog<SkillGroupData, UseActiveSkillGroupDialogProps | undefined>(
  (ctrl, props) => (
    <ActiveSkillGroupFormDialog
      ctrl={ctrl}
      group={props?.group}
      disabledGroups={props?.disabledGroups}
      onDelete={props?.onDelete}
    />
  ),
)
