import { builderStateFactory } from "#/components/builder/builderState.ts"
import { createCompatStore, scopeCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { rootReducer } from "#/lib/stores/root/rootStore.reducer.ts"
import type { RootStore } from "#/lib/stores/root/rootStore.ts"
import type { RunnerStore } from "#/lib/stores/runner/runnerStore.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/**
 * The store instance created per runner. Backs the merged root store (`{ runnerData, builder }`,
 * shared with the Builder's `BuilderState` when editing) but implements `RunnerStore` directly —
 * `getState`/`setState`/`subscribe`/`dispatch` all read and write only the `runnerData` slice.
 * Reach `root` for the underlying merged store (e.g. to derive a `BuilderStore` view over the
 * same instance, as `useBuilderStores` does).
 */
export class RunnerDataStore implements RunnerStore {
  readonly root: RootStore

  private readonly scoped: RunnerStore

  constructor(initialState: RunnerData) {
    this.root = createCompatStore(
      { runnerData: initialState, builder: builderStateFactory() },
      rootReducer,
    )
    this.scoped = scopeCompatStore(this.root, "runnerData")
  }

  get dispatch() {
    return this.scoped.dispatch
  }

  getState = (): RunnerData => this.scoped.getState()

  setState = (updater: (prev: RunnerData) => RunnerData): void => this.scoped.setState(updater)
  subscribe = (listener: (state: RunnerData) => void) => this.scoped.subscribe(listener)
}
