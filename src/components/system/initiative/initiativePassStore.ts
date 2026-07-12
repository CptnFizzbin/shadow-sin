import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import {
  clearRolledResults,
  gainExtraPass,
  resetPasses,
  setGoingFirst,
  setRolledResults,
  togglePass,
} from "#/stores/runner/initiative/initiativeSlice.actions.ts"
import { initiativeReducer } from "#/stores/runner/initiative/initiativeSlice.ts"

export interface InitiativePassState {
  passesCompleted: number[]
  rolledResults?: number[]
  goingFirst?: boolean
  extraPasses: number
}

/** Defaults `extraPasses` to 0 so consumers always get a number, even though it's optional on `RunnerData["initiative"]`. */
function normalize(state: ReturnType<typeof initiativeReducer>): InitiativePassState {
  return { ...state, extraPasses: state.extraPasses ?? 0 }
}

export class InitiativePassStore extends StoreSlice<InitiativePassState> {
  /** @deprecated Dispatch `togglePass` from `#/stores/runner/initiative/initiativeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  togglePass(passIndex: number): void {
    this.set((state) => normalize(initiativeReducer(state, togglePass(passIndex))))
  }

  /** @deprecated Dispatch `setRolledResults` from `#/stores/runner/initiative/initiativeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setRolledResults(results: number[]): void {
    this.set((state) => normalize(initiativeReducer(state, setRolledResults(results))))
  }

  /** @deprecated Dispatch `clearRolledResults` from `#/stores/runner/initiative/initiativeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  clearRolledResults(): void {
    this.set((state) => normalize(initiativeReducer(state, clearRolledResults())))
  }

  /** @deprecated Dispatch `setGoingFirst` from `#/stores/runner/initiative/initiativeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setGoingFirst(value: boolean): void {
    this.set((state) => normalize(initiativeReducer(state, setGoingFirst(value))))
  }

  /** @deprecated Dispatch `gainExtraPass` from `#/stores/runner/initiative/initiativeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  gainExtraPass(): void {
    this.set((state) => normalize(initiativeReducer(state, gainExtraPass())))
  }

  /** @deprecated Dispatch `resetPasses` from `#/stores/runner/initiative/initiativeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  resetPasses(): void {
    this.set((state) => normalize(initiativeReducer(state, resetPasses())))
  }
}
