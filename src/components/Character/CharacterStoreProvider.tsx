import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { Draft } from "immer"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

export const CharacterStoreContext =
  createContext<Store<PlayerCharacterData> | null>(null)

export interface CharacterStoreProviderProps extends PropsWithChildren {
  store: Store<PlayerCharacterData>
}

export const CharacterStoreProvider: FC<CharacterStoreProviderProps> = ({
  store,
  children,
}) => (
  <CharacterStoreContext.Provider value={store}>
    {children}
  </CharacterStoreContext.Provider>
)

type CharacterDataSelector<TData> = (state: PlayerCharacterData) => TData

export const useCharacterStoreContext = (): Store<PlayerCharacterData> => {
  const store = useContext(CharacterStoreContext)

  if (!store) {
    throw new Error(
      "useCharacterStoreContext must be used within a CharacterStoreProvider",
    )
  }

  return store
}

export function useCharacterStore<TData>(
  selector: CharacterDataSelector<TData>,
): TData {
  const store = useCharacterStoreContext()
  return useStore(store, selector)
}

export function useCharacterStoreSlice<TData extends object>(
  selector: CharacterDataSelector<TData>,
  setter: (
    state: Draft<PlayerCharacterData>,
    nextValue: Draft<TData>,
  ) => Draft<PlayerCharacterData>,
): StoreSlice<TData> {
  const store = useCharacterStoreContext()
  return useStoreSlice(store, selector, setter)
}
