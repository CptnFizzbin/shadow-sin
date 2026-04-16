import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"

export const ProfileSection: FC = () => {
  const profile = useCharacterSheet((s) => s.profile)
  const biology = useCharacterSheet((s) => s.biology)

  const publicAwareness = Math.max(
    0,
    Math.floor((profile.streetCred + profile.notoriety) / 3) + (profile.publicAwarenessModifier ?? 0),
  )

  return (
    <Stack gap={1} divider={<Divider />}>
      <Typography variant="h1" textAlign="center">{profile.alias || profile.name}</Typography>

      <Grid container alignItems="center">

        <Grid size={{ xs: 12, md: "auto" }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            <Typography color="text.secondary">
              {profile.name}
            </Typography>
            {(profile.archetype || biology.metatype) && (
              <Typography variant="subtitle2" color="text.secondary">
                {[profile.archetype, biology.metatype].filter(Boolean).join(" · ")}
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: "grow" }} sx={{ display: "flex", justifyContent: { md: "flex-end" } }}>
          <Stack direction="row" gap={0.5} alignItems="center">
            <Chip label={`Street Cred: ${profile.streetCred}`} size="small" variant="outlined" />
            <Chip label={`Notoriety: ${profile.notoriety}`} size="small" variant="outlined" color="warning" />
            <Chip label={`Public Awareness: ${publicAwareness}`} size="small" variant="outlined" color="error" />
          </Stack>
        </Grid>

      </Grid>

      {profile.description && (
        <Stack gap={0.5}>
          <Label label="Description" />
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {profile.description}
          </Typography>
        </Stack>
      )}

      {profile.personality && (
        <Stack gap={0.5}>
          <Label label="Personality" />
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {profile.personality}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
