import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { Draft } from "immer"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import type { CharacterSheet } from "#/lib/system/types/playerCharacterData.ts"

export const CharacterStoreContext =
  createContext<Store<CharacterSheet> | null>(null)

export interface CharacterStoreProviderProps extends PropsWithChildren {
  store: Store<CharacterSheet>
}

export const CharacterStoreProvider: FC<CharacterStoreProviderProps> = ({
  store,
  children,
}) => (
  <CharacterStoreContext.Provider value={store}>
    {children}
  </CharacterStoreContext.Provider>
)

type CharacterSheetSelector<TData> = (state: CharacterSheet) => TData

export const useCharacterStoreContext = (): Store<CharacterSheet> => {
  const store = useContext(CharacterStoreContext)

  if (!store) {
    throw new Error(
      "useCharacterStoreContext must be used within a CharacterStoreProvider",
    )
  }

  return store
}

export function useCharacterSheet<TData>(
  selector: CharacterSheetSelector<TData>,
): TData {
  const store = useCharacterStoreContext()
  return useStore(store, selector)
}

/** @deprecated Use useCharacterSheet instead. */
export const useCharacterStore = useCharacterSheet

export function useCharacterSheetSlice<TData extends object>(
  selector: CharacterSheetSelector<TData>,
  setter: (
    state: Draft<CharacterSheet>,
    nextValue: Draft<TData>,
  ) => Draft<CharacterSheet>,
): StoreSlice<TData> {
  const store = useCharacterStoreContext()
  return useStoreSlice(store, selector, setter)
}

/** @deprecated Use useCharacterSheetSlice instead. */
export const useCharacterStoreSlice = useCharacterSheetSlice
