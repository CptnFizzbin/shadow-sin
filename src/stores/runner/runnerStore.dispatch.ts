import { useCallback } from "react"

import type { AnyAction } from "#/integrations/reduxToolkit/dispatchActions.ts"
import { applyActions } from "#/integrations/reduxToolkit/dispatchActions.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { useRunnerDataContext } from "./runnerStore.context.ts"
import { runnerRootReducer } from "./runnerStore.reducer.ts"

/**
 * The one write entry point for `RunnerData`. Accepts a single RTK action, an array of them, or a
 * `ActionChain` (see `applyActions` / compound action creators like `burnEdge` in
 * `edge/edgeSlice.actions.ts`) — either way, every resulting action is folded through the
 * migrated domains' combined reducer ({@link runnerRootReducer}) and the FINAL result is written
 * back to the existing `RunnerDataStore` via a single `setState` call, so the store's own
 * subscribers (autosave in `src/routes/$runnerId.tsx`, and every
 * `useRunnerStoreSelector`/`useSelector` reader) fire exactly once per dispatch — a multi-action
 * compound dispatch is atomic, not N separate writes. Works unchanged in both the Viewer (a real
 * root store) and the Builder (a `createSliceAtom` slice of `BuilderRootState`), since both are
 * reached via the same `useRunnerDataContext()`.
 */
export function useRunnerStoreDispatch() {
  const store = useRunnerDataContext()

  return useCallback(
    (actionOrActions: AnyAction<RunnerData>) => {
      store.setState((prev) => applyActions(runnerRootReducer, prev, actionOrActions))
    },
    [store],
  )
}
