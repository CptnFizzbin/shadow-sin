import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { runnerRootReducer } from "#/stores/runner/runnerStore.reducer.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export class RunnerDataStore implements RunnerStore {
  private readonly compatStore: RunnerStore

  constructor(initialState: RunnerData) {
    this.compatStore = createCompatStore(initialState, runnerRootReducer)
  }

  get dispatch() {
    return this.compatStore.dispatch
  }

  getState = (): RunnerData => this.compatStore.getState()
  get = (): RunnerData => this.compatStore.getState()

  get state(): RunnerData {
    return this.compatStore.getState()
  }

  setState = (updater: (prev: RunnerData) => RunnerData): void => this.compatStore.setState(updater)
  subscribe = (listener: (state: RunnerData) => void) => this.compatStore.subscribe(listener)

  set(data: RunnerData): void {
    this.setState(() => data)
  }
}
