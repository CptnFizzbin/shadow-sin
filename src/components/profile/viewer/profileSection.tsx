import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { ProfileSelectors } from "#/state/runner/profile/profile.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export const ProfileSection: FC = () => {
  const profile = useRunnerSelector(ProfileSelectors.select)

  return (
    <Stack divider={<Divider />}>
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
