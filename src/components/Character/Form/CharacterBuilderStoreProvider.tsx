import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { Draft } from "immer"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"
import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"

export const CharacterBuilderContext =
  createContext<Store<CharacterFormState> | null>(null)

export interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
  store: Store<CharacterFormState>
}

export const CharacterBuilderStoreProvider: FC<
  CharacterBuilderStoreProviderProps
> = ({ store, children }) => (
  <CharacterBuilderContext.Provider value={store}>
    {children}
  </CharacterBuilderContext.Provider>
)

export const useCharacterBuilderStoreContext =
  (): Store<CharacterFormState> => {
    const store = useContext(CharacterBuilderContext)

    if (!store) {
      throw new Error(
        "useCharacterSheet must be used within a CharacterBuilderStoreProvider",
      )
    }

    return store
  }

type CharacterSheetSelector<TData> = (state: CharacterFormState) => TData

export function useCharacterSheet<TData>(
  selector: CharacterSheetSelector<TData>,
): TData {
  const store = useCharacterBuilderStoreContext()
  return useStore(store, selector)
}

/** @deprecated Use useCharacterSheet instead. */
export const useCharacterBuilderStore = useCharacterSheet

export function useCharacterSheetSlice<TData>(
  selector: CharacterSheetSelector<TData>,
  setter: (
    state: Draft<CharacterFormState>,
    newValue: Draft<TData>,
  ) => Draft<CharacterFormState>,
): StoreSlice<TData> {
  const store = useCharacterBuilderStoreContext()
  return useStoreSlice(store, selector, setter)
}

/** @deprecated Use useCharacterSheetSlice instead. */
export const useCharacterBuilderStoreSlice = useCharacterSheetSlice
