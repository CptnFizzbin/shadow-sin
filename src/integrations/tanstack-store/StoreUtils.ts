import { useStore } from "@tanstack/react-store"
import { createNonReactiveReadonlyStore } from "@tanstack/router-core"
import { ReadonlyStore, Store } from "@tanstack/store"
import type { Draft } from "immer"
import { produce } from "immer"
import { useMemo } from "react"

export interface StoreSlice<TData> extends ReadonlyStore<TData> {
  update(updater: (prev: Draft<TData>) => void): void
}

export const useStoreSlice = <TRoot, TData>(
  store: Store<TRoot>,
  selector: (state: TRoot) => TData,
): StoreSlice<TData> => {
  const value = useStore(store, selector)

  return useMemo(() => {
    const slice = createNonReactiveReadonlyStore(
      () => value,
    ) as StoreSlice<TData>

    slice.update = (updater) => {
      store.setState((prev) => {
        return produce(prev, (draft) => {
          const draftSlice = selector(draft as TRoot) as Draft<TData>
          updater(draftSlice)
        })
      })
    }

    return slice
  }, [value])
}
