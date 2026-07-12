import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import {
  setProfileAlias,
  setProfileArchetype,
  setProfileDescription,
  setProfileName,
  setProfilePersonality,
  setProfilePublicAwarenessModifier,
} from "#/stores/runner/profile/profileSlice.actions.ts"
import { profileReducer } from "#/stores/runner/profile/profileSlice.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type ProfileStoreState = RunnerData["profile"]

export class ProfileStore extends StoreSlice<ProfileStoreState> {
  setState(stateOrUpdater: ProfileStoreState | ((prev: ProfileStoreState) => ProfileStoreState)) {
    this.set(stateOrUpdater)
  }

  /** @deprecated Dispatch `setProfileName` from `#/stores/runner/profile/profileSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setName(name: string): void {
    this.set((prev) => profileReducer(prev, setProfileName(name)))
  }

  /** @deprecated Dispatch `setProfileAlias` from `#/stores/runner/profile/profileSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setAlias(alias: string): void {
    this.set((prev) => profileReducer(prev, setProfileAlias(alias)))
  }

  /** @deprecated Dispatch `setProfileArchetype` from `#/stores/runner/profile/profileSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setArchetype(archetype: string | undefined): void {
    this.set((prev) => profileReducer(prev, setProfileArchetype(archetype)))
  }

  /** @deprecated Dispatch `setProfileDescription` from `#/stores/runner/profile/profileSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setDescription(description: string | undefined): void {
    this.set((prev) => profileReducer(prev, setProfileDescription(description)))
  }

  /** @deprecated Dispatch `setProfilePersonality` from `#/stores/runner/profile/profileSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setPersonality(personality: string | undefined): void {
    this.set((prev) => profileReducer(prev, setProfilePersonality(personality)))
  }

  /** @deprecated Dispatch `setProfilePublicAwarenessModifier` from `#/stores/runner/profile/profileSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setPublicAwarenessModifier(publicAwarenessModifier: number | undefined): void {
    this.set((prev) => profileReducer(prev, setProfilePublicAwarenessModifier(publicAwarenessModifier)))
  }
}
