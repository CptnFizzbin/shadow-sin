import { produce } from "immer"

import { applyActions } from "#/integrations/reduxToolkit/dispatchActions.ts"
import type { Recipe } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { burnEdge } from "#/stores/runner/edge/edgeSlice.actions.ts"
import { edgeSlice, restoreEdge, setEdgeCurrent } from "#/stores/runner/edge/edgeSlice.ts"
import { runnerRootReducer } from "#/stores/runner/runnerStore.reducer.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface EdgeStoreState {
  max: number
  current: number
}

export class EdgeStore extends StoreSlice<EdgeStoreState> {
  /** @deprecated Dispatch `setEdgeCurrent` from `#/stores/runner/edge/edgeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  setCurrent(valueOrUpdater: number | Recipe<number>): void {
    this.set(
      produce((state) => {
        const next = valueOrUpdater instanceof Function ? valueOrUpdater(state.current) : valueOrUpdater
        const { current } = edgeSlice.reducer({ current: state.current }, setEdgeCurrent({ value: next, max: state.max }))
        state.current = current
      }),
    )
  }

  /** @deprecated Dispatch `restoreEdge` from `#/stores/runner/edge/edgeSlice.ts` via `useRunnerStoreDispatch()` instead. */
  restore(): void {
    this.set(
      produce((state) => {
        const { current } = edgeSlice.reducer({ current: state.current }, restoreEdge({ max: state.max }))
        state.current = current
      }),
    )
  }

  /** @deprecated Dispatch `Actions.edge.burnEdge()` from `#/stores/runner/runnerStore.actions.ts` via `useRunnerStoreDispatch()` instead. */
  burn(): void {
    this.set((state) => {
      // Reconstitute just enough of RunnerData for the compound action's ActionChain (which reads
      // attributes.edge to compute the new max) and its two resulting sub-actions
      // (edge.burnCurrent + attributes.set) to run through the real root reducer.
      const fakeRoot = {
        edge: { current: state.current },
        attributes: { [AttributeKey.edge]: state.max },
      } as RunnerData

      const next = applyActions(runnerRootReducer, fakeRoot, burnEdge())

      return { max: next.attributes[AttributeKey.edge], current: next.edge.current }
    })
  }
}
