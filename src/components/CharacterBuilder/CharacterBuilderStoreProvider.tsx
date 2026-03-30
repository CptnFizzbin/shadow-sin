import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { CharacterSheetProvider } from "#/components/Character/CharacterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/Character/CharacterSheetStore.ts"
import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const CharacterBuilderContext =
  createContext<Store<CharacterBuilderState> | null>(null)

export interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
  builderStateStore: Store<CharacterBuilderState>
}

export const CharacterBuilderStoreProvider: FC<
  CharacterBuilderStoreProviderProps
> = ({ builderStateStore, children }) => {
  const characterSheetStore = useMemo((): CharacterSheetStore => {
    const sheetStore = createStore<CharacterSheet>(() => builderStateStore.state.characterSheet)

    return new CharacterSheetStore({
      get: () => sheetStore.get(),
      set: (valueOrUpdater) => {
        builderStateStore.setState(produce((prev) => {
          prev.characterSheet =
            typeof valueOrUpdater === "function"
              ? valueOrUpdater(prev.characterSheet)
              : valueOrUpdater
        }))
      },
      subscribe: (listener) => sheetStore.subscribe(listener),
    })
  }, [builderStateStore])

  return (
    <CharacterBuilderContext.Provider value={builderStateStore}>
      <CharacterSheetProvider store={characterSheetStore}>
        {children}
      </CharacterSheetProvider>
    </CharacterBuilderContext.Provider>
  )
}

export const useCharacterBuilderStoreContext = (): Store<CharacterBuilderState> => {
  const store = useContext(CharacterBuilderContext)

  if (!store) {
    throw new Error(
      "useCharacterBuilderStoreContext must be used within a CharacterBuilderStoreProvider",
    )
  }

  return store
}
