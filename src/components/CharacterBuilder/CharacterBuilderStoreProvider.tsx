import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import { CharacterSheetProvider } from "#/components/Character/CharacterSheetProvider.tsx"
import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const CharacterBuilderContext =
  createContext<Store<CharacterBuilderState> | null>(null)

export interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
  builderStateStore: Store<CharacterBuilderState>
  characterSheetStore: Store<CharacterSheet>
}

export const CharacterBuilderStoreProvider: FC<
  CharacterBuilderStoreProviderProps
> = ({ builderStateStore, characterSheetStore, children }) => (
  <CharacterBuilderContext.Provider value={builderStateStore}>
    <CharacterSheetProvider store={characterSheetStore}>
      {children}
    </CharacterSheetProvider>
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

type CharacterBuilderSelector<TData> = (state: CharacterBuilderState) => TData

export function useCharacterBuilderStore<TData>(
  selector: CharacterBuilderSelector<TData>,
): TData {
  const store = useCharacterBuilderStoreContext()
  return useStore(store, selector)
}
