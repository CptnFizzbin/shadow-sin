import type { FC } from "react"

import type { ProfileFieldsValue } from "#/components/runner/profile/profileFields.tsx"
import { ProfileFields } from "#/components/runner/profile/profileFields.tsx"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const ProfileSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const profile = useRunnerSelector(ProfileSelectors.select)

  const handleChange = (field: keyof ProfileFieldsValue, value: string) => {
    switch (field) {
      case "alias":
        dispatch(Actions.profile.setProfileAlias(value))
        break
      case "name":
        dispatch(Actions.profile.setProfileName(value))
        break
      case "archetype":
        dispatch(Actions.profile.setProfileArchetype(value || null))
        break
      case "description":
        dispatch(Actions.profile.setProfileDescription(value || null))
        break
      case "personality":
        dispatch(Actions.profile.setProfilePersonality(value || null))
        break
    }
  }

  return (
    <ProfileFields
      value={{
        alias: profile.alias,
        name: profile.name,
        archetype: profile.archetype ?? "",
        description: profile.description ?? "",
        personality: profile.personality ?? "",
      }}
      onChange={handleChange}
    />
  )
}
