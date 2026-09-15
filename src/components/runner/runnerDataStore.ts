import { createSimpleStore } from "#/lib/simpleStore.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

/**
 * A test-isolation seed for `RunnerStoreProvider`: constructs a fresh `RunnerStore` instance from
 * a starting `RunnerData` value, without needing a real `RunnerState` singleton around it up
 * front. Tests hold onto the instance to seed a Provider and, when needed, poke `setState`
 * directly to mimic an external write — `RunnerStoreProvider` redirects the instance to read and
 * write through the real `RunnerState` store it creates, so those calls keep working the same way
 * once one exists, without this store keeping its own value in sync alongside it.
 */
export class RunnerDataStore implements RunnerStore {
  private readonly store: RunnerStore

  constructor(initialState: RunnerData) {
    this.store = createSimpleStore(initialState)
  }

  getState = (): RunnerData => this.store.getState()

  setState = (updater: (prev: RunnerData) => RunnerData): void => this.store.setState(updater)

  subscribe = (listener: (state: RunnerData) => void) => this.store.subscribe(listener)

  redirectTo = (delegate: Omit<RunnerStore, "redirectTo">): void => this.store.redirectTo(delegate)
}
