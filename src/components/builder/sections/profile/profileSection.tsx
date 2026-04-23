import MuiTextField from "@mui/material/TextField"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { selectProfile } from "#/components/character/profile/profileSelectors.ts"
import { useProfileStore } from "#/components/character/profile/useProfileStore.ts"

export const ProfileSection: FC = () => {
  const profileStore = useProfileStore()
  const profile = useStore(profileStore, selectProfile)

  return (
    <>
      <MuiTextField
        label="Alias"
        fullWidth
        variant="outlined"
        size="small"
        value={profile.alias}
        onChange={(event) => profileStore.setAlias(event.target.value)}
      />

      <MuiTextField
        label="Name"
        fullWidth
        variant="outlined"
        size="small"
        value={profile.name}
        onChange={(event) => profileStore.setName(event.target.value)}
      />

      <MuiTextField
        label="Archetype"
        fullWidth
        variant="outlined"
        size="small"
        value={profile.archetype ?? ""}
        onChange={(event) =>
          profileStore.setArchetype(event.target.value || undefined)}
      />

      <MuiTextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        size="small"
        value={profile.description ?? ""}
        onChange={(event) =>
          profileStore.setDescription(event.target.value || undefined)}
      />

      <MuiTextField
        label="Personality"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        size="small"
        value={profile.personality ?? ""}
        onChange={(event) =>
          profileStore.setPersonality(event.target.value || undefined)}
      />
    </>
  )
}
