import type { UnknownAction } from "@reduxjs/toolkit"
import { useCallback } from "react"

import { useRunnerDataContext } from "./runnerStore.context.ts"
import { runnerRootReducer } from "./runnerStore.reducer.ts"

/**
 * The one write entry point for `RunnerData`. Dispatches an RTK action through the migrated
 * domains' combined reducer ({@link runnerRootReducer}) and writes the result back to the
 * existing `RunnerDataStore` via `setState` — so the store's own subscribers (autosave in
 * `src/routes/$runnerId.tsx`, and every `useRunnerStoreSelector`/`useSelector` reader) fire
 * exactly as they do today. Works unchanged in both the Viewer (a real root store) and the
 * Builder (a `createSliceAtom` slice of `BuilderRootState`), since both are reached via the same
 * `useRunnerDataContext()`.
 */
export function useRunnerStoreDispatch() {
  const store = useRunnerDataContext()

  return useCallback(
    (action: UnknownAction) => {
      store.setState((prev) => runnerRootReducer(prev, action))
    },
    [store],
  )
}
