import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import { useRootStoreContext } from "#/lib/contexts/root/rootStore.context.ts"

import type { RootState } from "./rootStore.ts"

export type RootStateSelector<T> = (state: RootState) => T

/**
 * Reactive read of the merged root store — `{ runnerData, builder }`. Domain code should prefer
 * the `RunnerData`-scoped `useRunnerStoreSelector`, which curries a `RunnerData` selector into
 * one of these.
 */
export function useRootStoreSelector<T>(
  selector: RootStateSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  const store = useRootStoreContext()
  return useSelector(store, selector, { compare })
}
