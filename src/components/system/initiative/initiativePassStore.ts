import { produce } from "immer"

import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"

export interface InitiativePassState {
  passesCompleted: number[]
  rolledResults?: number[]
  goingFirst?: boolean
}

export class InitiativePassStore extends StoreSlice<InitiativePassState> {
  togglePass(passIndex: number): void {
    this.set(
      produce((state) => {
        const completed = new Set(state.passesCompleted)
        if (completed.has(passIndex)) {
          completed.delete(passIndex)
        } else {
          completed.add(passIndex)
        }
        state.passesCompleted = Array.from(completed)
      }),
    )
  }

  setRolledResults(results: number[]): void {
    this.set(produce((state) => {
      state.rolledResults = results
    }))
  }

  clearRolledResults(): void {
    this.set(produce((state) => {
      state.rolledResults = undefined
    }))
  }

  setGoingFirst(value: boolean): void {
    this.set(produce((state) => {
      state.goingFirst = value
    }))
  }

  resetPasses(): void {
    this.set(
      produce((state) => {
        state.passesCompleted = []
        state.rolledResults = undefined
        state.goingFirst = undefined
      }),
    )
  }
}
