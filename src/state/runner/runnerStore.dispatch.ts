import type { UnknownAction } from "@reduxjs/toolkit"

import type { AppDispatch } from "#/state/rootState.ts"
import { createRootStore, useAppDispatch } from "#/state/rootState.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

export type RunnerDispatch = AppDispatch

/**
 * The one write entry point for `RunnerData`. Dispatches actions through the singleton store's
 * `configureStore` `dispatch` — plain actions run through the combined domain reducer
 * (`runnerRootReducer`); thunks (including `createAsyncThunk` actions) run natively via
 * `configureStore`'s default thunk middleware. Works unchanged in both the Viewer and the Builder,
 * since both are backed by the same singleton `RootState` store.
 *
 * @deprecated use {@link useAppDispatch} instead
 */
export function useRunnerStoreDispatch(): RunnerDispatch {
  return useAppDispatch()
}

/**
 * A one-shot, store-less version of {@link useRunnerStoreDispatch} for non-React contexts: tests
 * that need to run an action/thunk against a scratch `RunnerData` without mounting a provider.
 * Applies `action` (and any thunks it dispatches) against `state` — wrapped in a scratch
 * singleton-shaped store, since a dispatched thunk's `getState()` needs the same `AppState` shape
 * it gets in production — and resolves to the merged `RunnerData` once the whole chain settles.
 */
export async function dispatchThunk<TAction extends Parameters<AppDispatch>[number]>(
  state: RunnerData,
  action: TAction,
): Promise<RunnerData> {
  const store = createRootStore({ mode: "viewer", runner: state })
  // `action` is a concrete thunk/action at every call site, just not a type `dispatch`'s
  // overloads can resolve through a generic `TAction` — this cast doesn't change what actually
  // runs, since RTK's `dispatch` branches on the value itself (function vs. plain action) at
  // runtime, not on its declared type.
  await store.dispatch(action as UnknownAction)
  return toRunnerData(store.getState())
}
