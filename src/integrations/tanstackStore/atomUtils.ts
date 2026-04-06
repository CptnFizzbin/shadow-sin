import type { AnyAtom, Atom, Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"

export function isAnyAtom(obj: unknown): obj is AnyAtom {
  return typeof obj === "object"
    && obj !== null
    && "get" in obj
    && typeof obj.get === "function"
    && "set" in obj
    && typeof obj.set === "function"
    && "subscribe" in obj
    && typeof obj.subscribe === "function"
}

export type Recipe<TData> = (prev: TData) => TData
export type SliceUpdater<TData> = Recipe<TData>
export type RootUpdater<TRoot, TData> = (prevRoot: TRoot, slice: TData) => TRoot

export function createSliceAtom<TRoot, TData>(
  root: Store<TRoot> | Atom<TRoot>,
  selector: (root: TRoot) => TData,
  updater: RootUpdater<TRoot, TData>,
): Atom<TData> {
  const slice = createStore(() => selector(root.get()))

  return {
    get: () => slice.get(),
    set: (valueOrUpdater) => {
      const rootRecipe = (prevRoot: TRoot) => {
        let nextSlice: TData

        if (typeof valueOrUpdater !== "function") {
          nextSlice = valueOrUpdater
        } else {
          const sliceUpdater = valueOrUpdater as (prev: TData) => TData
          nextSlice = sliceUpdater(selector(prevRoot))
        }

        return updater(prevRoot, nextSlice)
      }

      return "setState" in root
        ? root.setState(rootRecipe)
        : root.set(rootRecipe)
    },
    subscribe: (listener) => slice.subscribe(listener),
  }
}
