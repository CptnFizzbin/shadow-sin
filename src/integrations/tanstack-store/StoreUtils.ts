import { createStore, ReadonlyStore, Store } from "@tanstack/store"
import type { Draft } from "immer"
import { produce } from "immer"

export interface StoreSlice<TData> extends ReadonlyStore<TData> {
  update(updater: (prev: Draft<TData>) => void): void
}

export const createStoreSlice = <TRoot extends object, TData extends object>(
  store: Store<TRoot>,
  selector: (state: TRoot) => TData,
): StoreSlice<TData> => {
  const slice = createStore(() => selector(store.state)) as StoreSlice<TData>

  slice.update = (updater) => {
    store.setState((prev) => {
      return produce(prev, (draft) => {
        const draftSlice = selector(draft as TRoot) as Draft<TData>
        updater(draftSlice)
      })
    })
  }

  return slice
}
