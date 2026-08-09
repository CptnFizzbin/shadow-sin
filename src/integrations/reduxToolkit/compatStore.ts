import type { Reducer, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"
import { configureStore, createAction } from "@reduxjs/toolkit"

export type StateUpdater<TState> = (prev: TState) => TState

export interface CompatStore<TState> {
  readonly dispatch: ThunkDispatch<TState, undefined, UnknownAction>
  getState: () => TState
  setState: (updater: StateUpdater<TState>) => void
  subscribe: (listener: (state: TState) => void) => { unsubscribe: () => void }
}

/**
 * A `configureStore` instance exposed through a `getState`/`setState`/`subscribe` API, for call
 * sites that want a plain "read a snapshot, write a next value" store instead of dispatching
 * actions directly.
 *
 * `setState` accepts either a plain `(prev) => next` function or an Immer `produce(recipe)` call.
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

  // serializableCheck is disabled because `applyUpdater`'s payload is a function by design (the
  // `(prev) => next` updater itself); immutableCheck is disabled because callers are free to hold
  // a snapshot from `getState()`, mutate it, and write it back via `setState` (some test helpers
  // do exactly this).
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
    setState: (updater) => {
      store.dispatch(applyUpdater(updater))
    },
    subscribe: (listener) => {
      const unsubscribe = store.subscribe(() => listener(store.getState()))
      return { unsubscribe }
    },
  }
}

/**
 * A read/write view onto one named slice of a {@link CompatStore}, sharing the same underlying
 * store instance as `root` — writes go through `root`'s reducer, and the slice's `subscribe` only
 * fires when that slice's reference actually changes.
 *
 * Dispatching a thunk (a function, e.g. from `createAsyncThunk`) runs it directly against this
 * slice's own `dispatch`/`getState` rather than `root`'s, so thunks typed against the slice's own
 * state keep seeing that type at runtime, even though `root.getState()` returns the wider state.
 */
export function scopeCompatStore<TRoot, TKey extends keyof TRoot & string>(
  root: CompatStore<TRoot>,
  key: TKey,
): CompatStore<TRoot[TKey]> {
  type TSlice = TRoot[TKey]

  const getState = (): TSlice => root.getState()[key]

  const dispatch = ((action: unknown) => {
    if (typeof action === "function") {
      return (action as (dispatch: unknown, getState: () => TSlice, extra: undefined) => unknown)(
        dispatch,
        getState,
        undefined,
      )
    }
    return root.dispatch(action as UnknownAction)
  }) as CompatStore<TSlice>["dispatch"]

  return {
    dispatch,
    getState,
    setState: (updater) => root.setState((prev) => {
      const next = { ...prev }
      next[key] = updater(prev[key])
      return next
    }),
    subscribe: (listener) => {
      let prevSlice = getState()
      return root.subscribe(() => {
        const nextSlice = getState()
        if (nextSlice !== prevSlice) {
          prevSlice = nextSlice
          listener(nextSlice)
        }
      })
    },
  }
}
