import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

/**
 * A test-isolation seed for `RunnerStoreProvider`: holds a starting `RunnerData` value, without
 * needing a real `RunnerState` singleton around it up front. Tests hold onto the instance to seed
 * a Provider and, when needed, poke `setState` directly to mimic an external write —
 * `RunnerStoreProvider` redirects the instance (via `redirectTo`) to read and write through the
 * real `RunnerState` store it creates, so those calls keep working the same way once one exists,
 * without this store keeping its own value in sync alongside it.
 */
export class RunnerDataStore implements RunnerStore {
  private state: RunnerData
  private delegate: Omit<RunnerStore, "redirectTo"> | null = null

  constructor(initialState: RunnerData) {
    this.state = initialState
  }

  getState = (): RunnerData => this.delegate ? this.delegate.getState() : this.state

  setState = (updater: (prev: RunnerData) => RunnerData): void => {
    if (this.delegate) {
      this.delegate.setState(updater)
      return
    }
    this.state = updater(this.state)
  }

  // Nothing subscribes before `redirectTo` runs — `RunnerStoreProvider` calls it synchronously
  // while constructing the store this instance is seeding, before render (and therefore before
  // any test code) can run — so there's never a standalone value's own change to notify here.
  subscribe = (listener: (state: RunnerData) => void) => {
    return this.delegate ? this.delegate.subscribe(listener) : { unsubscribe: () => {} }
  }

  redirectTo = (delegate: Omit<RunnerStore, "redirectTo">): void => {
    this.delegate = delegate
  }
}
