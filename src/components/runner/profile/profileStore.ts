import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type ProfileStoreState = RunnerData["profile"]

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
