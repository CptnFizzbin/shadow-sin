import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import type { StoreSelector, StoreSlice, StoreUpdater } from "#/integrations/tanstack-store/StoreUtils.ts"
import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"

export const CharacterBuilderContext =
  createContext<Store<CharacterBuilderState> | null>(null)

export interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
  store: Store<CharacterBuilderState>
}

export const CharacterBuilderStoreProvider: FC<
  CharacterBuilderStoreProviderProps
> = ({ store, children }) => (
  <CharacterBuilderContext.Provider value={store}>
    {children}
  </CharacterBuilderContext.Provider>
)

export const useCharacterBuilderStoreContext =
  (): Store<CharacterBuilderState> => {
    const store = useContext(CharacterBuilderContext)

    if (!store) {
      throw new Error(
        "useCharacterBuilderStoreContext must be used within a CharacterBuilderStoreProvider",
      )
    }

    return store
  }

type CharacterBuilderSelector<TData> = StoreSelector<CharacterBuilderState, TData>
type CharacterBuilderUpdater<TData> = StoreUpdater<CharacterBuilderState, TData>

export function useCharacterBuilderStore<TData>(
  selector: CharacterBuilderSelector<TData>,
): TData {
  const store = useCharacterBuilderStoreContext()
  return useStore(store, selector)
}

export function useCharacterBuilderStoreSlice<TData>(
  selector: CharacterBuilderSelector<TData>,
  updater: CharacterBuilderUpdater<TData>,
): StoreSlice<TData> {
  const store = useCharacterBuilderStoreContext()
  return useStoreSlice<CharacterBuilderState, TData>(store, selector, updater)
}
