import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { Label } from "#/components/UI/text/label.tsx"

export const ProfileSection: FC = () => {
  const profile = useCharacterSheet((s) => s.profile)
  const biology = useCharacterSheet((s) => s.biology)

  const publicAwareness = Math.max(
    0,
    Math.floor((profile.streetCred + profile.notoriety) / 3) + (profile.publicAwarenessModifier ?? 0),
  )

  return (
    <Stack gap={1} divider={<Divider />}>
      <Stack gap={1}>
        <Stack gap={0.25}>
          <Typography variant="h5">{profile.alias || profile.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.name}
          </Typography>
          {(profile.archetype || biology.metatype) && (
            <Typography variant="subtitle2" color="text.secondary">
              {[profile.archetype, biology.metatype].filter(Boolean).join(" · ")}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" gap={1} flexWrap="wrap">
          {profile.streetCred > 0 && (
            <Chip label={`Street Cred: ${profile.streetCred}`} size="small" variant="outlined" />
          )}
          {profile.notoriety > 0 && (
            <Chip label={`Notoriety: ${profile.notoriety}`} size="small" variant="outlined" color="warning" />
          )}
          {publicAwareness > 0 && (
            <Chip label={`Public Awareness: ${publicAwareness}`} size="small" variant="outlined" color="error" />
          )}
          {profile.lifestyle && (
            <Chip
              label={`${profile.lifestyle.quality} · ${profile.lifestyle.monthsPaid}mo`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
        </Stack>
      </Stack>

      {profile.description && (
        <Stack gap={0.5}>
          <Label label="Description" variant="text" textAlign="left" />
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {profile.description}
          </Typography>
        </Stack>
      )}

      {profile.personality && (
        <Stack gap={0.5}>
          <Label label="Personality" variant="text" textAlign="left" />
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {profile.personality}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
