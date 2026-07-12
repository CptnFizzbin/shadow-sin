import type { Recipe } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { burnEdge, restoreAllEdge, setCurrentEdge } from "#/stores/runner/edge/edgeSlice.actions.ts"
import { dispatchThunk } from "#/stores/runner/runnerStore.dispatch.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface EdgeStoreState {
  max: number
  current: number
}

export class EdgeStore extends StoreSlice<EdgeStoreState> {
  /**
   * Reconstitutes just enough of a `RunnerData` "fake root" from this store's local
   * `{max, current}` view to run real actions/thunks against via {@link dispatchThunk}.
   */
  private fakeRoot(): RunnerData {
    const { max, current } = this.state
    return { edge: { current }, attributes: { [AttributeKey.edge]: max } } as RunnerData
  }

  /** @deprecated Dispatch `setCurrentEdge` from `#/stores/runner/edge/edgeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  async setCurrent(valueOrUpdater: number | Recipe<number>): Promise<void> {
    const { max, current } = this.state
    const next = valueOrUpdater instanceof Function ? valueOrUpdater(current) : valueOrUpdater
    const result = await dispatchThunk(this.fakeRoot(), setCurrentEdge(next))
    this.set({ max, current: result.edge.current })
  }

  /** @deprecated Dispatch `restoreAllEdge` from `#/stores/runner/edge/edgeSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  async restore(): Promise<void> {
    const { max } = this.state
    const result = await dispatchThunk(this.fakeRoot(), restoreAllEdge())
    this.set({ max, current: result.edge.current })
  }

  /** @deprecated Dispatch `Actions.edge.burnEdge()` from `#/stores/runner/runnerStore.actions.ts` via `useRunnerStoreDispatch()` instead. */
  async burn(): Promise<void> {
    const result = await dispatchThunk(this.fakeRoot(), burnEdge())
    this.set({ max: result.attributes[AttributeKey.edge], current: result.edge.current })
  }
}
