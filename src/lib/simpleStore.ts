export interface SimpleStore<TState> {
  getState: () => TState
  setState: (updater: (prev: TState) => TState) => void
  subscribe: (listener: (state: TState) => void) => { unsubscribe: () => void }
}

/**
 * A plain "read a snapshot, write a next value, get notified on change" state container: no
 * dispatchable actions, no reducer, no middleware. Use this where something only ever needs to
 * hold and observe a single value — e.g. seeding the singleton `RootState` store
 * (`src/state/rootState.ts`) with a test's initial `RunnerData`/`BuilderState` — as opposed to
 * `createCompatStore` (`src/integrations/reduxToolkit/compatStore.ts`), which backs a real
 * `configureStore` instance for callers that need dispatchable actions/thunks.
 */
export function createSimpleStore<TState>(initialState: TState): SimpleStore<TState> {
  let state = initialState
  const listeners = new Set<(state: TState) => void>()

  return {
    getState: () => state,
    setState: (updater) => {
      state = updater(state)
      for (const listener of listeners) listener(state)
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return { unsubscribe: () => listeners.delete(listener) }
    },
  }
}
