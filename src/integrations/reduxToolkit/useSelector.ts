import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector"

import type { CompatStore } from "./compatStore.ts"

export interface UseSelectorOptions<TSelected> {
  compare?: (prev: TSelected, next: TSelected) => boolean
}

/**
 * Reactive read of a {@link CompatStore}. Reading directly off `store.state`/`store.get()` gives a
 * snapshot and will not trigger re-renders — always use this for reactive reads.
 */
export function useSelector<TState, TSelected>(
  store: Pick<CompatStore<TState>, "getState" | "subscribe">,
  selector: (state: TState) => TSelected,
  options?: UseSelectorOptions<TSelected>,
): TSelected {
  return useSyncExternalStoreWithSelector(
    (onStoreChange) => store.subscribe(() => onStoreChange()).unsubscribe,
    store.getState,
    store.getState,
    selector,
    options?.compare,
  )
}
