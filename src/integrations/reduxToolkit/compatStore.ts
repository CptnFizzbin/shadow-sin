import type { Reducer, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"
import { configureStore, createAction } from "@reduxjs/toolkit"

export type StateUpdater<TState> = (prev: TState) => TState

export interface CompatStore<TState> {
  readonly dispatch: ThunkDispatch<TState, undefined, UnknownAction>
  getState: () => TState
  /** @deprecated alias for {@link getState}, kept for call sites ported from `@tanstack/store`. */
  get: () => TState
  /** @deprecated snapshot alias for {@link getState}, kept for call sites ported from `@tanstack/store`. */
  readonly state: TState
  setState: (updater: StateUpdater<TState>) => void
  subscribe: (listener: (state: TState) => void) => { unsubscribe: () => void }
}

/**
 * A real `configureStore` instance wrapped in the `get`/`state`/`setState`/`subscribe` shape this
 * app's stores exposed under `@tanstack/store`, so call sites didn't need to change when the
 * underlying engine did.
 *
 * `setState` dispatches a single internal action carrying the `(prev state) => next state)`
 * updater — an Immer `produce(recipe)` call and a plain `(prev) => next` function both work,
 * exactly as they did with `Store.setState`. `configureStore`'s `serializableCheck` is disabled
 * because that payload is a function by design, and `immutableStateInvariantMiddleware` is
 * disabled because `Store.get()`/`.state` callers (including deprecated test helpers that mutate a
 * fetched snapshot before writing it back via `setState`) were always free to hold and mutate a
 * live reference under `@tanstack/store`.
 *
 * Pass a real domain `reducer` (e.g. a `combineReducers` result) to back a store with dispatchable
 * actions/thunks; omit it for stores that are only ever written through `setState` (mirroring
 * `createStore(initialValue)`).
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
