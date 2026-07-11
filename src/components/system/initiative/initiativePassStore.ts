import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import {
  clearRolledResults,
  gainExtraPass,
  initiativeSlice,
  resetPasses,
  setGoingFirst,
  setRolledResults,
  togglePass,
} from "#/stores/runner/initiative/initiativeSlice.ts"

export interface InitiativePassState {
  passesCompleted: number[]
  rolledResults?: number[]
  goingFirst?: boolean
  extraPasses: number
}

/** The new slice's `extraPasses` is optional (mirrors `RunnerData["initiative"]`); the old store's isn't. */
function normalize(state: ReturnType<typeof initiativeSlice.reducer>): InitiativePassState {
  return { ...state, extraPasses: state.extraPasses ?? 0 }
}

export class InitiativePassStore extends StoreSlice<InitiativePassState> {
  /** @deprecated Dispatch `togglePass` from `#/stores/runner/initiative/initiativeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  togglePass(passIndex: number): void {
    this.set((state) => normalize(initiativeSlice.reducer(state, togglePass(passIndex))))
  }

  /** @deprecated Dispatch `setRolledResults` from `#/stores/runner/initiative/initiativeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  setRolledResults(results: number[]): void {
    this.set((state) => normalize(initiativeSlice.reducer(state, setRolledResults(results))))
  }

  /** @deprecated Dispatch `clearRolledResults` from `#/stores/runner/initiative/initiativeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  clearRolledResults(): void {
    this.set((state) => normalize(initiativeSlice.reducer(state, clearRolledResults())))
  }

  /** @deprecated Dispatch `setGoingFirst` from `#/stores/runner/initiative/initiativeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  setGoingFirst(value: boolean): void {
    this.set((state) => normalize(initiativeSlice.reducer(state, setGoingFirst(value))))
  }

  /** @deprecated Dispatch `gainExtraPass` from `#/stores/runner/initiative/initiativeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  gainExtraPass(): void {
    this.set((state) => normalize(initiativeSlice.reducer(state, gainExtraPass())))
  }

  /** @deprecated Dispatch `resetPasses` from `#/stores/runner/initiative/initiativeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  resetPasses(): void {
    this.set((state) => normalize(initiativeSlice.reducer(state, resetPasses())))
  }
}
