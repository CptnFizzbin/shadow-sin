import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export type ProfileStoreState = CharacterSheet["profile"]

export interface UseProfileStore extends BaseAtom<ProfileStoreState> {
  setName(name: string): void

  setAlias(alias: string): void

  setArchetype(archetype: string | undefined): void

  setDescription(description: string | undefined): void

  setPersonality(personality: string | undefined): void

  setState(state: ProfileStoreState): void

  setState(updater: (prev: ProfileStoreState) => ProfileStoreState): void
}

export const useProfileStore = (): UseProfileStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseProfileStore => {
    const profileStore = createStore(() => store.state.profile)

    const toUpdater = <T>(valueOrUpdater: T | ((prev: T) => T)): ((prev: T) => T) =>
      typeof valueOrUpdater === "function"
        ? (valueOrUpdater as (prev: T) => T)
        : () => valueOrUpdater

    return {
      get: () => profileStore.get(),
      subscribe: (listener) => profileStore.subscribe(listener),

      setState: (stateOrUpdater) => {
        const updater = toUpdater(stateOrUpdater)
        store.setState(produce((prev) => {
          prev.profile = updater(prev.profile)
        }))
      },

      setName: (name) => {
        store.setState(produce((prev) => {
          prev.profile.name = name
        }))
      },

      setAlias: (alias) => {
        store.setState(produce((prev) => {
          prev.profile.alias = alias
        }))
      },

      setArchetype: (archetype) => {
        store.setState(produce((prev) => {
          prev.profile.archetype = archetype
        }))
      },

      setDescription: (description) => {
        store.setState(produce((prev) => {
          prev.profile.description = description
        }))
      },

      setPersonality: (personality) => {
        store.setState(produce((prev) => {
          prev.profile.personality = personality
        }))
      },
    }
  }, [store])
}
