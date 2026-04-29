import type { FC, PropsWithChildren } from "react"

import type { CharacterSheet } from "#/system/characterSheet.ts"

import { CharacterAttributesProvider } from "./characterAttributesProvider.tsx"
import { useCharacterSheetSelector } from "./characterSheet.selectors.ts"
import { CharacterSheetContext, useCharacterSheetContext } from "./characterSheetContext.ts"
import type { CharacterSheetStore } from "./characterSheetStore.ts"

export { useCharacterSheetContext }

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

/**
 * @deprecated use {@link useCharacterSheetSelector} instead
 * @param selector
 */
export function useCharacterSheet<TData>(
  selector: CharacterDataSelector<TData>,
) {
  return useCharacterSheetSelector(selector)
}
