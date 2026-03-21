import { useStore } from "@tanstack/react-store"
import type { ReadonlyStore, Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import type { Draft } from "immer"
import { produce } from "immer"
import { useMemo, useRef } from "react"

export type Recipe<TData> = (draft: Draft<TData>) => void | Draft<TData>

export interface StoreSlice<TData> extends ReadonlyStore<TData> {
  update(updater: Recipe<TData>): void
}

export const useStoreSlice = <TRoot, TData>(
  store: Store<TRoot>,
  selector: (state: TRoot) => TData,
  setter: (state: Draft<TRoot>, nextValue: Draft<TData>) => Draft<TRoot>,
): StoreSlice<TData> => {
  const value = useStore(store, selector)

  const selectorRef = useRef(selector)
  selectorRef.current = selector

  const setterRef = useRef(setter)
  setterRef.current = setter

  return useMemo(() => {
    const slice = createStore(() => value) as StoreSlice<TData>

    slice.update = (updater) => {
      store.setState((prev) => {
        const recipe: Recipe<TRoot> = (draft) => {
          const draftSlice = selectorRef.current(draft as TRoot) as Draft<TData>
          const nextSlice = updater(draftSlice)
          return setterRef.current(draft, nextSlice ?? draftSlice)
        }

        return produce(prev, recipe)
      })
    }

    return slice
  }, [value])
}
