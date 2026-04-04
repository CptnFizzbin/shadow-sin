import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/atom-utils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/store-slice.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"

export type ProfileStoreState = CharacterSheet["profile"]

export class ProfileStore extends StoreSlice<ProfileStoreState> {
  setState(stateOrUpdater: ProfileStoreState | ((prev: ProfileStoreState) => ProfileStoreState)) {
    this.set(stateOrUpdater)
  }

  setName(name: string): void {
    this.set((prev) => ({ ...prev, name }))
  }

  setAlias(alias: string): void {
    this.set((prev) => ({ ...prev, alias }))
  }

  setArchetype(archetype: string | undefined): void {
    this.set((prev) => ({ ...prev, archetype }))
  }

  setDescription(description: string | undefined): void {
    this.set((prev) => ({ ...prev, description }))
  }

  setPersonality(personality: string | undefined): void {
    this.set((prev) => ({ ...prev, personality }))
  }

  setPublicAwarenessModifier(publicAwarenessModifier: number | undefined): void {
    this.set((prev) => ({ ...prev, publicAwarenessModifier }))
  }
}

export const useProfileStore = (): ProfileStore => {
  const store = useCharacterSheetContext()

  return useMemo((): ProfileStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.profile,
      (root, profile) => produce(root, (draft) => { draft.profile = profile }),
    )

    return new ProfileStore(atom)
  }, [store])
}
