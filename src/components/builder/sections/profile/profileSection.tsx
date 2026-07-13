import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const ProfileSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const profile = useRunnerStoreSelector(Selectors.profile.selectProfile)

  return (
    <>
      <MuiTextField
        label="Alias"
        fullWidth
        variant="outlined"
        size="small"
        value={profile.alias}
        onChange={(event) => dispatch(Actions.profile.setProfileAlias(event.target.value))}
      />

      <MuiTextField
        label="Name"
        fullWidth
        variant="outlined"
        size="small"
        value={profile.name}
        onChange={(event) => dispatch(Actions.profile.setProfileName(event.target.value))}
      />

      <MuiTextField
        label="Archetype"
        fullWidth
        variant="outlined"
        size="small"
        value={profile.archetype ?? ""}
        onChange={(event) =>
          dispatch(Actions.profile.setProfileArchetype(event.target.value || null))}
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
          dispatch(Actions.profile.setProfileDescription(event.target.value || null))}
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
          dispatch(Actions.profile.setProfilePersonality(event.target.value || null))}
      />
    </>
  )
}
