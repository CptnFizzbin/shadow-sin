import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { CharacterSheet } from "#/system/characterSheet.ts"

// eslint-disable-next-line import-x/no-cycle
import { CharacterAttributesProvider } from "./characterAttributesProvider.tsx"
import { useCharacterSheetSelector } from "./characterSheet.selectors.ts"
import type { CharacterSheetStore } from "./characterSheetStore.ts"

const CharacterSheetContext = createContext<CharacterSheetStore | null>(null)

interface CharacterSheetProviderProps extends PropsWithChildren {
  store: CharacterSheetStore
}

export const CharacterSheetProvider: FC<CharacterSheetProviderProps> = ({
  store,
  children,
}) => {
  return (
    <CharacterSheetContext.Provider value={store}>
      <CharacterAttributesProvider>
        {children}
      </CharacterAttributesProvider>
    </CharacterSheetContext.Provider>
  )
}

type CharacterDataSelector<TData> = (state: CharacterSheet) => TData

export const useCharacterSheetContext = (): CharacterSheetStore => {
  const store = useContext(CharacterSheetContext)

  if (!store) {
    throw new Error(
      "useCharacterSheetContext must be used within a CharacterSheetProvider",
    )
  }

  return store
}

/**
 * @deprecated use {@link useCharacterSheetSelector} instead
 * @param selector
 */
export function useCharacterSheet<TData>(
  selector: CharacterDataSelector<TData>,
) {
  return useCharacterSheetSelector(selector)
}
