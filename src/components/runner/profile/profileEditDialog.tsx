import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { produce } from "immer"
import type { FC } from "react"
import { useState } from "react"

import { useRunnerData, useRunnerDataContext } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"

type ProfileEditDialogProps = ControlledDialogProps<void>

const ProfileEditDialog: FC<ProfileEditDialogProps> = ({ ctrl }) => {
  const store = useRunnerDataContext()
  const profile = useRunnerData((s) => s.profile)
  const biology = useRunnerData((s) => s.biology)

  const [alias, setAlias] = useState(profile.alias)
  const [name, setName] = useState(profile.name)
  const [archetype, setArchetype] = useState(profile.archetype ?? "")
  const [description, setDescription] = useState(profile.description ?? "")
  const [personality, setPersonality] = useState(profile.personality ?? "")
  const [gender, setGender] = useState(biology.gender ?? "")
  const [age, setAge] = useState(biology.age?.toString() ?? "")
  const [height, setHeight] = useState(biology.height ?? "")
  const [weight, setWeight] = useState(biology.weight ?? "")

  const handleSave = () => {
    store.setState(
      produce((prev) => {
        prev.profile.alias = alias
        prev.profile.name = name
        prev.profile.archetype = archetype || null
        prev.profile.description = description || null
        prev.profile.personality = personality || null
        prev.biology.gender = gender || null
        prev.biology.age = age ? Number(age) : null
        prev.biology.height = height || null
        prev.biology.weight = weight || null
      }),
    )
    ctrl.close()
  }

  return (
    <ControlledDialog ctrl={ctrl}>
      <Dialog.Title>Edit Profile</Dialog.Title>

      <Dialog.Content>
        <Stack divider={<Divider />} sx={{ gap: 2, padding: 1 }}>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="subtitle2">Profile</Typography>
            <MuiTextField
              label="Alias"
              fullWidth
              variant="outlined"
              size="small"
              autoFocus
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <MuiTextField
              label="Name"
              fullWidth
              variant="outlined"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <MuiTextField
              label="Archetype"
              fullWidth
              variant="outlined"
              size="small"
              value={archetype}
              onChange={(e) => setArchetype(e.target.value)}
            />
            <MuiTextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <MuiTextField
              label="Personality"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              size="small"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
            />
          </Stack>

          <Stack sx={{ gap: 1 }}>
            <Typography variant="subtitle2">Biology</Typography>
            <Stack direction="row" sx={{ gap: 1 }}>
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
            <Stack direction="row" sx={{ gap: 1 }}>
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
