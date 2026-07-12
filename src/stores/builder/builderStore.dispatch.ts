import type { ThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"
import { useMemo } from "react"

import type { BuilderState } from "#/components/builder/builderState.ts"

import { useBuilderDataContext } from "./builderStore.context.ts"
import { builderRootReducer } from "./builderStore.reducer.ts"

export type BuilderDispatch = ThunkDispatch<BuilderState, undefined, UnknownAction>

export type BuilderAction = UnknownAction | ThunkAction<unknown, BuilderState, undefined, UnknownAction>

/**
 * Hand-rolled `redux-thunk` equivalent, mirroring `useRunnerStoreDispatch` — see that hook's doc
 * comment for why (no `configureStore`/middleware pipeline in this app).
 */
function createThunkDispatch(getState: () => BuilderState, applyAction: (action: UnknownAction) => void): BuilderDispatch {
  const dispatch = ((action: unknown) => {
    if (typeof action === "function") {
      return action(dispatch, getState, undefined)
    }
    applyAction(action as UnknownAction)
    return action
  }) as BuilderDispatch

  return dispatch
}

/**
 * The one write entry point for `BuilderState`. Applies dispatched actions through
 * {@link builderRootReducer} and writes the result back to the `BuilderStateStore` via `setState`,
 * so the store's own subscribers (localStorage autosave, `useBuilderStoreSelector`) fire.
 */
export function useBuilderStoreDispatch(): BuilderDispatch {
  const store = useBuilderDataContext()

  return useMemo(
    () => createThunkDispatch(
      () => store.state,
      (action) => store.setState((prev) => builderRootReducer(prev, action)),
    ),
    [store],
  )
}

/** A one-shot, store-less version of {@link useBuilderStoreDispatch} for non-React contexts (tests). */
export async function dispatchBuilderThunk(state: BuilderState, action: BuilderAction): Promise<BuilderState> {
  let current = state

  const dispatch = createThunkDispatch(
    () => current,
    (a) => { current = builderRootReducer(current, a) },
  )

  await dispatch(action)
  return current
}
