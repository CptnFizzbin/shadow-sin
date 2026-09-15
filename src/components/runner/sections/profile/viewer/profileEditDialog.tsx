import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { BiologyActions } from "#/state/runner/biology/biology.actions.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { ProfileActions } from "#/state/runner/profile/profile.actions.ts"
import { ProfileSelectors } from "#/state/runner/profile/profile.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { useRunnerStateDispatch } from "#/state/runnerState.ts"

import type { ProfileFieldsValue } from "./profileFields.tsx"
import { ProfileFields } from "./profileFields.tsx"

type ProfileEditDialogProps = ControlledDialogProps<void>

const ProfileEditDialog: FC<ProfileEditDialogProps> = ({ ctrl }) => {
  const dispatch = useRunnerStateDispatch()
  const profile = useRunnerSelector(ProfileSelectors.select)
  const biology = useRunnerSelector(BiologySelectors.select)

  const [profileFields, setProfileFields] = useState<ProfileFieldsValue>({
    alias: profile.alias,
    name: profile.name,
    archetype: profile.archetype ?? "",
    description: profile.description ?? "",
    personality: profile.personality ?? "",
  })
  const [gender, setGender] = useState(biology.gender ?? "")
  const [age, setAge] = useState(biology.age?.toString() ?? "")
  const [height, setHeight] = useState(biology.height ?? "")
  const [weight, setWeight] = useState(biology.weight ?? "")

  const handleProfileFieldChange = (field: keyof ProfileFieldsValue, value: string) => {
    setProfileFields((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    dispatch(ProfileActions.patch({
      alias: profileFields.alias,
      name: profileFields.name,
      archetype: profileFields.archetype || null,
      description: profileFields.description || null,
      personality: profileFields.personality || null,
    }))

    dispatch(BiologyActions.setBiology({
      awakening: biology.awakening,
      metatype: biology.metatype,
      gender: gender || null,
      age: age ? Number(age) : null,
      height: height || null,
      weight: weight || null,
    }))

    ctrl.close()
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>Edit Profile</Dialog.Title>

      <Dialog.Content>
        <Stack divider={<Divider />} sx={{ gap: 2, padding: 1 }}>
          <Stack>
            <Typography variant="subtitle2">Profile</Typography>
            <ProfileFields value={profileFields} onChange={handleProfileFieldChange} autoFocus />
          </Stack>

          <Stack>
            <Typography variant="subtitle2">Biology</Typography>
            <Stack direction="row">
              <MuiTextField
                label="Gender"
                fullWidth
                variant="outlined"
                size="small"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              <MuiTextField
                label="Age"
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Stack>
            <Stack direction="row">
              <MuiTextField
                label="Height"
                fullWidth
                variant="outlined"
                size="small"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <MuiTextField
                label="Weight"
                fullWidth
                variant="outlined"
                size="small"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Stack>
          </Stack>
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>
        <Button color="secondary" variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useProfileEditDialog = () => useDialog<void>((ctrl) => <ProfileEditDialog ctrl={ctrl} />)
