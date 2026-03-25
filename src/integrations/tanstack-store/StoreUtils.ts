import { useStore } from "@tanstack/react-store"
import type { ReadonlyStore, Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import type { Draft } from "immer"
import { produce } from "immer"
import { useEffect, useMemo, useRef } from "react"

export type Recipe<TData> = (draft: Draft<TData>) => void | Draft<TData>

export interface StoreSlice<TData> extends ReadonlyStore<TData> {
  update(updater: Recipe<TData>): void
}

export type StoreSelector<TRoot, TData> = (state: TRoot) => TData
export type StoreUpdater<TRoot, TData> = (
  state: Draft<TRoot>,
  next: TData,
) => Draft<TRoot>

export const useStoreSlice = <TRoot, TData>(
  store: Store<TRoot>,
  selector: StoreSelector<TRoot, TData>,
  setter: StoreUpdater<TRoot, TData>,
): StoreSlice<TData> => {
  const value = useStore(store, selector)

  const selectorRef = useRef(selector)
  useEffect(() => {
    selectorRef.current = selector
  }, [selector])

  const setterRef = useRef(setter)
  useEffect(() => {
    setterRef.current = setter
  }, [setter])

  return useMemo(() => {
    const slice = createStore(() => value) as StoreSlice<TData>

    slice.update = (updater) => {
      store.setState((prev) => {
        const currentSlice = selectorRef.current(prev)
        const nextSlice = produce(currentSlice, updater)

        return produce(prev, (draft) => {
          return setterRef.current(draft, nextSlice)
        })
      })
    }

    return slice
  }, [value])
}
