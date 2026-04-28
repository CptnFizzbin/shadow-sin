import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

// eslint-disable-next-line import-x/no-cycle -- Temprorary, as the character sheet context is used in the selector, and the selector is used in the character sheet context
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import type { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

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
      {children}
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
