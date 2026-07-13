import type { BuilderState } from "#/components/builder/builderState.ts"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"

import { useBuilderDataContext } from "./builderStore.context.ts"
import * as nuyenSelectors from "./nuyen/nuyenSlice.selectors.ts"

export type BuilderStateSelector<T> = (state: BuilderState) => T

export function useBuilderStoreSelector<T>(
  selector: BuilderStateSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  const store = useBuilderDataContext()
  return useSelector(store, selector, { compare })
}

/**
 * Namespaced access to `BuilderState`'s selectors (`Selectors.nuyen.selectStartingNuyen`).
 * Mirrors `Selectors` in `runnerStore.selectors.ts`.
 */
export const Selectors = {
  nuyen: nuyenSelectors,
}
