import type { BuilderStore } from "#/state/builder/builderStore.ts"

import type { BuilderState } from "./builderState.ts"

/**
 * A test-isolation seed for `renderInBuilder`: holds a starting `BuilderState` value, without
 * needing a real `RunnerState` singleton around it up front — mirrors `RunnerDataStore`.
 * `renderInBuilder` redirects the returned store (via `redirectTo`) to read and write through the
 * real `RunnerState` store's `builder` slice once it creates one, without this store keeping its
 * own value in sync alongside it.
 */
export function createBuilderDataStore(initialState: BuilderState): BuilderStore {
  let state = initialState
  let delegate: Omit<BuilderStore, "redirectTo"> | null = null

  return {
    getState: () => delegate ? delegate.getState() : state,
    setState: (updater) => {
      if (delegate) {
        delegate.setState(updater)
        return
      }
      state = updater(state)
    },
    // See `RunnerDataStore.subscribe` — nothing subscribes before `redirectTo` runs.
    subscribe: (listener) => delegate ? delegate.subscribe(listener) : { unsubscribe: () => {} },
    redirectTo: (d) => {
      delegate = d
    },
  }
}
