import { useSelector } from "@tanstack/react-store"

import type { BuilderState } from "#/components/builder/builderState.ts"

import * as builderSelectors from "./builderSlice.selectors.ts"
import { useBuilderDataContext } from "./builderStore.context.ts"

export type BuilderStateSelector<T> = (state: BuilderState) => T

export function useBuilderStoreSelector<T>(
  selector: BuilderStateSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  const store = useBuilderDataContext()
  return useSelector(store, selector, { compare })
}

/**
 * Namespaced access to `BuilderState`'s selectors (`Selectors.builder.selectStartingNuyen`).
 * Mirrors `Selectors` in `runnerStore.selectors.ts`.
 */
export const Selectors = {
  builder: builderSelectors,
}
