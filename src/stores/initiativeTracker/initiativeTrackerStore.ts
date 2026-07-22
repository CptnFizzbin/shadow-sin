import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"

import type { InitiativeTrackerState } from "./initiativeTrackerData.ts"
import { initialState, initiativeTrackerReducer } from "./initiativeTrackerSlice.ts"

/**
 * A single, app-wide instance — the GM runs one combat at a time, so unlike
 * the per-runner store this needs no context/provider to pick an instance.
 */
export const initiativeTrackerStore = createCompatStore(initialState, initiativeTrackerReducer)

export type InitiativeTrackerDispatch = typeof initiativeTrackerStore.dispatch

export function useInitiativeTrackerDispatch(): InitiativeTrackerDispatch {
  return initiativeTrackerStore.dispatch
}

export function useInitiativeTrackerSelector<TSelected>(
  selector: (state: InitiativeTrackerState) => TSelected,
  compare?: (prev: TSelected, next: TSelected) => boolean,
): TSelected {
  return useSelector(initiativeTrackerStore, selector, { compare })
}
