import type { FC } from "react"

import type { ProfileFieldsValue } from "#/components/runner/sections/profile/viewer/profileFields.tsx"
import { ProfileFields } from "#/components/runner/sections/profile/viewer/profileFields.tsx"
import { ProfileSelectors } from "#/state/runner/profile/profile.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

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
