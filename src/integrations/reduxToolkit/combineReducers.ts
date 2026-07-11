import type { UnknownAction } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

export type SliceReducer<TKey extends keyof RunnerData> =
  (state: RunnerData[TKey], action: UnknownAction) => RunnerData[TKey]

export type RunnerReducerMap =
  { [TKey in keyof RunnerData]?: SliceReducer<TKey> }

/**
 * Applies every registered domain reducer to its corresponding `RunnerData` field for the given
 * action. Deliberately not RTK's `combineReducers`/`combineSlices`, which require exhaustive
 * coverage of every key up front — this tolerates a partially-migrated `RunnerData` shape, so
 * migrated and unmigrated domains (still on the old `StoreSlice`/`createSliceAtom` stores) coexist
 * safely during the incremental migration.
 */
export function combineReducers(sliceReducers: RunnerReducerMap) {
  return function runnerRootReducer(state: RunnerData, action: UnknownAction): RunnerData {
    let next = state

    for (const key of Object.keys(sliceReducers) as (keyof RunnerData)[]) {
      const reducer = sliceReducers[key] as SliceReducer<typeof key> | undefined
      if (!reducer) continue

      const prevValue = state[key]
      const nextValue = reducer(prevValue, action)

      if (nextValue !== prevValue) {
        if (next === state) next = { ...state }
        next[key] = nextValue as never
      }
    }

    return next
  }
}
