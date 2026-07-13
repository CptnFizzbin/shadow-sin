import type { Reducer, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"
import { configureStore, createAction } from "@reduxjs/toolkit"

export type StateUpdater<TState> = (prev: TState) => TState

export interface CompatStore<TState> {
  readonly dispatch: ThunkDispatch<TState, undefined, UnknownAction>
  getState: () => TState
  /** @deprecated alias for {@link getState}. */
  get: () => TState
  /** @deprecated snapshot alias for {@link getState}. */
  readonly state: TState
  setState: (updater: StateUpdater<TState>) => void
  subscribe: (listener: (state: TState) => void) => { unsubscribe: () => void }
}

/**
 * A `configureStore` instance exposed through a `get`/`state`/`setState`/`subscribe` API, for call
 * sites that want a plain "read a snapshot, write a next value" store instead of dispatching
 * actions directly.
 *
 * `setState` dispatches a single internal action carrying the `(prev state) => next state)`
 * updater — an Immer `produce(recipe)` call and a plain `(prev) => next` function both work.
 * `configureStore`'s `serializableCheck` is disabled because that payload is a function by design,
 * and `immutableStateInvariantMiddleware` is disabled because callers are free to hold a snapshot
 * from `get()`/`.state`, mutate it, and write it back via `setState` (some test helpers do exactly
 * this).
 *
 * Pass a domain `reducer` (e.g. a `combineReducers` result) to back a store with dispatchable
 * actions/thunks; omit it for stores that are only ever written through `setState`.
 */
export function createCompatStore<TState>(
  preloadedState: TState,
  reducer: Reducer<TState> = (state = preloadedState) => state,
): CompatStore<TState> {
  const applyUpdater = createAction<StateUpdater<TState>>("compatStore/setState")

  const rootReducer: Reducer<TState> = (state, action) => {
    if (applyUpdater.match(action)) {
      return action.payload(state as TState)
    }
    return reducer(state, action)
  }

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  })

  return {
    dispatch: store.dispatch,
    getState: () => store.getState(),
    get: () => store.getState(),
    get state() {
      return store.getState()
    },
    setState: (updater) => {
      store.dispatch(applyUpdater(updater))
    },
    subscribe: (listener) => {
      const unsubscribe = store.subscribe(() => listener(store.getState()))
      return { unsubscribe }
    },
  }
}
