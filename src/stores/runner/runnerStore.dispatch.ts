import type { ThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"
import { useMemo } from "react"

import type { RunnerData } from "#/system/runnerData.ts"

import { useRunnerDataContext } from "./runnerStore.context.ts"
import { runnerRootReducer } from "./runnerStore.reducer.ts"

export type RunnerDispatch = ThunkDispatch<RunnerData, undefined, UnknownAction>

export type RunnerAction = UnknownAction | ThunkAction<unknown, RunnerData, undefined, UnknownAction>

/**
 * Hand-rolled `redux-thunk` equivalent, since this app has no `configureStore`/middleware
 * pipeline: a dispatched function (a plain thunk, or a `createAsyncThunk` action) is invoked with
 * `dispatch`/`getState` instead of being reduced; a plain action is handed to `applyAction`. A
 * thunk's own nested `dispatch` calls recurse back through this same function, so they're handled
 * the same way.
 */
function createThunkDispatch(getState: () => RunnerData, applyAction: (action: UnknownAction) => void): RunnerDispatch {
  const dispatch = ((action: unknown) => {
    if (typeof action === "function") {
      return action(dispatch, getState, undefined)
    }
    applyAction(action as UnknownAction)
    return action
  }) as RunnerDispatch

  return dispatch
}

/**
 * The one write entry point for `RunnerData`. Applies dispatched actions through the combined
 * domain reducer ({@link runnerRootReducer}) and writes the result back to the `RunnerDataStore`
 * via `setState`, so the store's own subscribers (autosave in `src/routes/$runnerId.tsx`, and
 * every `useRunnerStoreSelector`/`useSelector` reader) fire. Works unchanged in both the Viewer (a
 * real root store) and the Builder (a `createSliceAtom` slice of `BuilderRootState`), since both
 * are reached via the same `useRunnerDataContext()`.
 */
export function useRunnerStoreDispatch(): RunnerDispatch {
  const store = useRunnerDataContext()

  return useMemo(
    () => createThunkDispatch(
      () => store.state,
      (action) => store.setState((prev) => runnerRootReducer(prev, action)),
    ),
    [store],
  )
}

/**
 * A one-shot, store-less version of {@link useRunnerStoreDispatch} for non-React contexts: tests,
 * and deprecated per-domain `StoreSlice` compat classes (e.g. `EdgeStore`) that reconstruct a
 * minimal "fake root" `RunnerData` from their own narrower local state to run real actions/thunks
 * against. Applies `action` (and any thunks it dispatches) against `state` and resolves once the
 * whole chain has settled.
 */
export async function dispatchThunk(state: RunnerData, action: RunnerAction): Promise<RunnerData> {
  let current = state

  const dispatch = createThunkDispatch(
    () => current,
    (a) => { current = runnerRootReducer(current, a) },
  )

  await dispatch(action)
  return current
}
