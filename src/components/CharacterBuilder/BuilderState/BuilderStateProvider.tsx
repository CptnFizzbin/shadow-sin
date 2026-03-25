import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { BuilderState } from "#/components/CharacterBuilder/BuilderState/BuilderState.ts"
import type {
  StoreSelector,
  StoreSlice,
  StoreUpdater,
} from "#/integrations/tanstack-store/StoreUtils.ts"
import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"

export const BuilderStoreContext = createContext<Store<BuilderState> | null>(
  null,
)

export interface BuilderStoreProviderProps extends PropsWithChildren {
  store: Store<BuilderState>
}

export const BuilderStateProvider: FC<BuilderStoreProviderProps> = ({
  store,
  children,
}) => (
  <BuilderStoreContext.Provider value={store}>
    {children}
  </BuilderStoreContext.Provider>
)

export function useBuildState(): Store<BuilderState> {
  const store = useContext(BuilderStoreContext)

  if (!store) {
    throw new Error(
      "useBuilderStore must be used within a BuilderStoreProvider",
    )
  }

  return store
}

type BuildStateSelector<TData> = StoreSelector<BuilderState, TData>
type BuildStateUpdater<TData> = StoreUpdater<BuilderState, TData>

export function useBuildStateStore<TData>(
  selector: BuildStateSelector<TData>,
): TData {
  const store = useBuildState()
  return useStore(store, selector)
}

export function useBuilderStoreSlice<TData>(
  selector: BuildStateSelector<TData>,
  setter: BuildStateUpdater<TData>,
): StoreSlice<TData> {
  const store = useBuildState()
  return useStoreSlice(store, selector, setter)
}
