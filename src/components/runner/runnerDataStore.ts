import { createSimpleStore } from "#/lib/simpleStore.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

/**
 * A test-isolation seed for `RunnerStoreProvider`: constructs a fresh `RunnerStore` instance from
 * a starting `RunnerData` value, without needing a real `RootState` singleton around it. Tests
 * hold onto the instance to seed a Provider and, when needed, poke `setState` directly to mimic
 * an external write.
 */
export class RunnerDataStore implements RunnerStore {
  private readonly store: RunnerStore

  constructor(initialState: RunnerData) {
    this.store = createSimpleStore(initialState)
  }

  getState = (): RunnerData => this.store.getState()

  setState = (updater: (prev: RunnerData) => RunnerData): void => this.store.setState(updater)

  subscribe = (listener: (state: RunnerData) => void) => this.store.subscribe(listener)
}
