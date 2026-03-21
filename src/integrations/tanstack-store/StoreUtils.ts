import { useStore } from "@tanstack/react-store"
import { createNonReactiveReadonlyStore } from "@tanstack/router-core"
import { ReadonlyStore, Store } from "@tanstack/store"
import type { Draft } from "immer"
import { produce } from "immer"
import { useMemo } from "react"

export type Recipe<TData> = (draft: Draft<TData>) => void | Draft<TData>

export interface StoreSlice<TData extends object> extends ReadonlyStore<TData> {
  update(updater: Recipe<TData>): void
}

export const useStoreSlice = <TRoot, TData extends object>(
  store: Store<TRoot>,
  selector: (state: TRoot) => TData,
  setter?: (state: Draft<TRoot>, nextValue: Draft<TData>) => Draft<TRoot>,
): StoreSlice<TData> => {
  const value = useStore(store, selector)

  return useMemo(() => {
    const slice = createNonReactiveReadonlyStore(
      () => value,
    ) as StoreSlice<TData>

    slice.update = (updater) => {
      store.setState((prev) => {
        const recipe: Recipe<TRoot> = (draft) => {
          const draftSlice = selector(draft as TRoot) as Draft<TData>
          const nextSlice = updater(draftSlice)

          if (nextSlice && setter) {
            setter(draft, nextSlice)
          }
        }

        return produce(prev, recipe)
      })
    }

    return slice
  }, [value])
}
