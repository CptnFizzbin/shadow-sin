import MuiTextField from "@mui/material/TextField"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectProfile } from "#/components/runner/profile/profileSelectors.ts"
import { useProfileStore } from "#/components/runner/profile/useProfileStore.ts"

export const ProfileSection: FC = () => {
  const profileStore = useProfileStore()
  const profile = useSelector(profileStore, selectProfile)

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
          profileStore.setArchetype(event.target.value || null)}
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
          profileStore.setDescription(event.target.value || null)}
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
          profileStore.setPersonality(event.target.value || null)}
      />
    </>
  )
}
