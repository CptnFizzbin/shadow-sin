import type { UnknownAction } from "@reduxjs/toolkit"

import type { RunnerStateDispatch } from "#/state/runnerState.ts"
import { createRunnerStateStore, useRunnerStateDispatch } from "#/state/runnerState.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

export type RunnerDispatch = RunnerStateDispatch

/**
 * The one write entry point for `RunnerData`. Dispatches actions through the singleton store's
 * `configureStore` `dispatch` — plain actions run through the combined domain reducer
 * (`runnerRootReducer`); thunks (including `createAsyncThunk` actions) run natively via
 * `configureStore`'s default thunk middleware. Works unchanged in both the Viewer and the Builder,
 * since both are backed by the same singleton `RunnerState` store.
 *
 * @deprecated use {@link useRunnerStateDispatch} instead
 */
export function useRunnerStoreDispatch(): RunnerDispatch {
  return useRunnerStateDispatch()
}

/**
 * A one-shot, store-less version of {@link useRunnerStoreDispatch} for non-React contexts: tests
 * that need to run an action/thunk against a scratch `RunnerData` without mounting a provider.
 * Applies `action` (and any thunks it dispatches) against `state` — wrapped in a scratch
 * singleton-shaped store, since a dispatched thunk's `getState()` needs the same `RunnerState` shape
 * it gets in production — and resolves to the merged `RunnerData` once the whole chain settles.
 */
export async function dispatchThunk<TAction extends Parameters<RunnerStateDispatch>[number]>(
  state: RunnerData,
  action: TAction,
): Promise<RunnerData> {
  const store = createRunnerStateStore({ mode: "viewer", runner: state })
  // `action` is a concrete thunk/action at every call site, just not a type `dispatch`'s
  // overloads can resolve through a generic `TAction` — this cast doesn't change what actually
  // runs, since RTK's `dispatch` branches on the value itself (function vs. plain action) at
  // runtime, not on its declared type.
  await store.dispatch(action as UnknownAction)
  return toRunnerData(store.getState())
}
