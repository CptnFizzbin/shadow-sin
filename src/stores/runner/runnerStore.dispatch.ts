import { useRunnerStoreContext } from "#/contexts/runner/runnerStore.context.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { runnerRootReducer } from "./runnerStore.reducer.ts"
import type { RunnerStore } from "./runnerStore.ts"

export type RunnerDispatch = RunnerStore["dispatch"]

export type RunnerAction = Parameters<RunnerDispatch>[0]

/**
 * The one write entry point for `RunnerData`. Dispatches actions through the store's
 * `configureStore` `dispatch` — plain actions run through the combined domain reducer
 * ({@link runnerRootReducer}); thunks (including `createAsyncThunk` actions) run natively via
 * `configureStore`'s default thunk middleware. Works unchanged in both the Viewer and the Builder,
 * since both are reached through the same `useRunnerStoreContext()`.
 */
export function useRunnerStoreDispatch(): RunnerDispatch {
  return useRunnerStoreContext().dispatch
}

/**
 * A one-shot, store-less version of {@link useRunnerStoreDispatch} for non-React contexts: tests
 * that need to run an action/thunk against a scratch `RunnerData` without mounting a provider.
 * Applies `action` (and any thunks it dispatches) against `state` and resolves once the whole
 * chain has settled.
 */
export async function dispatchThunk(state: RunnerData, action: RunnerAction): Promise<RunnerData> {
  const store = createCompatStore(state, runnerRootReducer)
  await store.dispatch(action)
  return store.getState()
}
