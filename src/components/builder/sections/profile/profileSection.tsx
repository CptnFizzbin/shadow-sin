import type { FC } from "react"

import type { ProfileFieldsValue } from "#/components/runner/profile/profileFields.tsx"
import { ProfileFields } from "#/components/runner/profile/profileFields.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const ProfileSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const profile = useRunnerStoreSelector(Selectors.profile.selectProfile)

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
