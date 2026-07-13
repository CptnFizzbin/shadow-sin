import { useBuilderDataContext } from "./builderStore.context.ts"
import type { BuilderStore } from "./builderStore.ts"

export type BuilderDispatch = BuilderStore["dispatch"]

/**
 * The one write entry point for `BuilderState`. Dispatches actions through the store's
 * `configureStore` `dispatch`, mirroring `useRunnerStoreDispatch`.
 */
export function useBuilderStoreDispatch(): BuilderDispatch {
  return useBuilderDataContext().dispatch
}
