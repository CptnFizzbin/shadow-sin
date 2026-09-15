export interface SimpleStore<TState> {
  getState: () => TState
  setState: (updater: (prev: TState) => TState) => void
  subscribe: (listener: (state: TState) => void) => { unsubscribe: () => void }
  /**
   * Redirects every future `getState`/`setState`/`subscribe` call to `delegate` instead of this
   * store's own standalone value — a store created up front (e.g. to seed a test) can become a
   * live view over a different, already-authoritative store once one exists, rather than keeping
   * two values in sync by mirroring writes back and forth between them.
   */
  redirectTo: (delegate: Omit<SimpleStore<TState>, "redirectTo">) => void
}

/**
 * A plain "read a snapshot, write a next value, get notified on change" state container: no
 * dispatchable actions, no reducer, no middleware. Use this where something only ever needs to
 * hold and observe a single value — e.g. seeding the singleton `RunnerState` store
 * (`src/state/runnerState.ts`) with a test's initial `RunnerData`/`BuilderState` — as opposed to
 * `createCompatStore` (`src/integrations/reduxToolkit/compatStore.ts`), which backs a real
 * `configureStore` instance for callers that need dispatchable actions/thunks.
 */
export function createSimpleStore<TState>(initialState: TState): SimpleStore<TState> {
  let state = initialState
  const listeners = new Set<(state: TState) => void>()
  let delegate: Omit<SimpleStore<TState>, "redirectTo"> | null = null

  return {
    getState: () => delegate ? delegate.getState() : state,
    setState: (updater) => {
      if (delegate) {
        delegate.setState(updater)
        return
      }
      state = updater(state)
      for (const listener of listeners) listener(state)
    },
    subscribe: (listener) => {
      if (delegate) return delegate.subscribe(listener)
      listeners.add(listener)
      return { unsubscribe: () => listeners.delete(listener) }
    },
    redirectTo: (d) => {
      delegate = d
    },
  }
}
