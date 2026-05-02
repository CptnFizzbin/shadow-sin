import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { produce } from "immer"
import type { FC } from "react"
import { useState } from "react"

import {
  useCharacterSheet,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

type ProfileEditDialogProps = ControlledDialogProps<void>

const ProfileEditDialog: FC<ProfileEditDialogProps> = ({ ctrl }) => {
  const store = useCharacterSheetContext()
  const profile = useCharacterSheet((s) => s.profile)
  const biology = useCharacterSheet((s) => s.biology)

  const [alias, setAlias] = useState(profile.alias)
  const [name, setName] = useState(profile.name)
  const [archetype, setArchetype] = useState(profile.archetype ?? "")
  const [gender, setGender] = useState(biology.gender ?? "")
  const [age, setAge] = useState(biology.age?.toString() ?? "")
  const [height, setHeight] = useState(biology.height ?? "")
  const [weight, setWeight] = useState(biology.weight ?? "")

  const handleSave = () => {
    store.setState(
      produce((prev) => {
        prev.profile.alias = alias
        prev.profile.name = name
        prev.profile.archetype = archetype || undefined
        prev.biology.gender = gender || undefined
        prev.biology.age = age ? Number(age) : undefined
        prev.biology.height = height || undefined
        prev.biology.weight = weight || undefined
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

export const useProfileEditDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: () => dialogApi.open<void>(
      (ctrl) => <ProfileEditDialog ctrl={ctrl} />,
    ),
  }
}
