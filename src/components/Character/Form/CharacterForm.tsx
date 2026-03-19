import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { type FC, useState } from "react"
import { AttributesFormGroup } from "#/components/Character/Form/Attributes/AttributesFormGroup.tsx"
import { BiologyFormGroup } from "#/components/Character/Form/Biology/BiologyFormGroup.tsx"
import { BpSummaryFooter } from "#/components/Character/Form/BpSummaryFooter.tsx"
import { GearFormGroup } from "#/components/Character/Form/Gear/GearFormGroup.tsx"
import { ProfileFormGroup } from "#/components/Character/Form/Profile/ProfileFormGroup.tsx"
import { QualitiesFormGroup } from "#/components/Character/Form/Qualities/QualitiesFormGroup.tsx"
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
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <Stack
        gap={1}
        sx={{
          paddingBottom: "56px",
          opacity: isBpPanelExpanded ? 0.6 : 1,
          transition: "opacity 0.2s ease",
          pointerEvents: isBpPanelExpanded ? "none" : "auto",
        }}
      >
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

        <Paper sx={{ padding: 1 }}>
          <Stack gap={1}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Qualities
            </Typography>

            <QualitiesFormGroup form={form} />
          </Stack>
        </Paper>

        <Paper sx={{ padding: 1 }}>
          <Stack gap={1}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Gear
            </Typography>

            <GearFormGroup form={form} />
          </Stack>
        </Paper>
      </Stack>

      <BpSummaryFooter form={form} onExpandedChange={setIsBpPanelExpanded} />
    </form>
  )
}
