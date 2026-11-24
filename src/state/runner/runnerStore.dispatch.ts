import type { UnknownAction } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

import type { RunnerStateDispatch } from "#/state/runnerState.ts"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

export type RunnerDispatch = RunnerStateDispatch

/**
 * The Runner dispatch hook: returns `dispatch` for the `RunnerState` store provided to the current
 * Viewer, Builder, or Editor tree. Accepts plain actions and thunks (including `createAsyncThunk`
 * actions). Must be called under a `RunnerStateProvider`.
 */
export const useRunnerStoreDispatch = useDispatch.withTypes<RunnerDispatch>()

/**
 * The non-React counterpart of {@link useRunnerStoreDispatch}, for tests that don't mount a
 * provider: applies `action` (and any thunks it dispatches) to `state` and resolves to the
 * resulting `RunnerData` once the whole chain settles.
 */
export async function dispatchThunk<TAction extends Parameters<RunnerStateDispatch>[number]>(
  state: RunnerData,
  action: TAction,
): Promise<RunnerData> {
  // A dispatched thunk's `getState()` needs the full `RunnerState` shape it gets in production,
  // so `state` runs inside a scratch store rather than through the reducers directly.
  const store = createRunnerStateStore({ mode: "viewer", runner: state })
  // `action` is a concrete thunk/action at every call site, just not a type `dispatch`'s
  // overloads can resolve through a generic `TAction` — this cast doesn't change what actually
  // runs, since RTK's `dispatch` branches on the value itself (function vs. plain action) at
  // runtime, not on its declared type.
  await store.dispatch(action as UnknownAction)
  return toRunnerData(store.getState())
}
