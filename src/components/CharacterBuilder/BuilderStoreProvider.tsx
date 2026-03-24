import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { Draft } from "immer"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { BuilderState } from "#/components/CharacterBuilder/BuilderState.ts"
import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"

export const BuilderStoreContext = createContext<Store<BuilderState> | null>(
  null,
)

export interface BuilderStoreProviderProps extends PropsWithChildren {
  store: Store<BuilderState>
}

export const BuilderStoreProvider: FC<BuilderStoreProviderProps> = ({
  store,
  children,
}) => (
  <BuilderStoreContext.Provider value={store}>
    {children}
  </BuilderStoreContext.Provider>
)

const useBuilderStoreContext = (): Store<BuilderState> => {
  const store = useContext(BuilderStoreContext)
  if (!store) {
    throw new Error(
      "useBuilderStore must be used within a BuilderStoreProvider",
    )
  }
  return store
}

type BuilderSelector<TData> = (state: BuilderState) => TData

export function useBuilderStore<TData>(
  selector: BuilderSelector<TData>,
): TData {
  const store = useBuilderStoreContext()
  return useStore(store, selector)
}

export function useBuilderStoreSlice<TData extends object>(
  selector: BuilderSelector<TData>,
  setter: (
    state: Draft<BuilderState>,
    nextValue: Draft<TData>,
  ) => Draft<BuilderState>,
): StoreSlice<TData> {
  const store = useBuilderStoreContext()
  return useStoreSlice(store, selector, setter)
}
