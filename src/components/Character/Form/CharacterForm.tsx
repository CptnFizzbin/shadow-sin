import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { AttributesFormGroup } from "#/components/Character/Form/Attributes/AttributesFormGroup.tsx"
import { BiologyFormGroup } from "#/components/Character/Form/Biology/BiologyFormGroup.tsx"
import { ProfileFormGroup } from "#/components/Character/Form/Profile/ProfileFormGroup.tsx"
import {
  type PlayerCharacterForm,
  useCharacterForm,
} from "#/components/Character/Form/UseCharacterForm.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

interface CharacterFormProps {
  character?: PlayerCharacterData
}

export const CharacterForm: FC<CharacterFormProps> = ({ character }) => {
  const form: PlayerCharacterForm = useCharacterForm(character)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <Stack gap={1}>
        <Paper sx={{ padding: 1 }}>
          <Stack gap={1}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Profile
            </Typography>

            <ProfileFormGroup form={form} />
          </Stack>
        </Paper>

        <Paper sx={{ padding: 1 }}>
          <Stack gap={1}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Biology
            </Typography>

            <BiologyFormGroup form={form} />
          </Stack>
        </Paper>

        <Paper sx={{ padding: 1 }}>
          <Stack gap={1}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Attributes
            </Typography>

            <AttributesFormGroup form={form} />
          </Stack>
        </Paper>
      </Stack>
    </form>
  )
}
