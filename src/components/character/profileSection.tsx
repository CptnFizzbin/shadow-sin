import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"

export const ProfileSection: FC = () => {
  const profile = useCharacterSheet((s) => s.profile)

  return (
    <Stack divider={<Divider />} sx={{ gap: 1 }}>
      {profile.description && (
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Description" />
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {profile.description}
          </Typography>
        </Stack>
      )}

      {profile.personality && (
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Personality" />
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {profile.personality}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
