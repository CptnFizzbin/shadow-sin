import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { Draft } from "immer"
import { produce } from "immer"
import { useEffect, useMemo, useRef } from "react"

export type Recipe<TData> = (draft: Draft<TData>) => void | Draft<TData>

export interface StoreSlice<TData> {
  state: TData

  update (updater: Recipe<TData>): void
}

export const useStoreSlice = <TRoot, TData> (
  store: Store<TRoot>,
  selector: (state: TRoot) => TData,
  updater: (state: Draft<TRoot>, nextValue: Draft<TData>) => Draft<TRoot>,
): StoreSlice<TData> => {
  const value = useStore(store, selector)
  const selectorRef = useRef(selector)
  const setterRef = useRef(updater)

  useEffect(() => {
    selectorRef.current = selector
  }, [selector])

  useEffect(() => {
    setterRef.current = updater
  }, [updater])

  return useMemo(() => {
    return {
      state: value,
      update: (updater) => {
        store.setState((prev) => {
          const recipe: Recipe<TRoot> = (draft) => {
            const draftSlice = selectorRef.current(
              draft as TRoot,
            ) as Draft<TData>
            const nextSlice = updater(draftSlice)
            return setterRef.current(draft, nextSlice ?? draftSlice)
          }

          return produce(prev, recipe)
        })
      },
    }
  }, [value])
}
