import type { FC, PropsWithChildren } from "react"

import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { CharacterSheetContext, useCharacterSheetContext } from "#/components/character/sheet/characterSheetContext.ts"
import type { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

export { CharacterSheetContext, useCharacterSheetContext }

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

export type CharacterDataSelector<TData> = (state: CharacterSheet) => TData

/**
 * @deprecated use {@link useCharacterSheetSelector} instead
 * @param selector
 */

export function useCharacterSheet<TData>(
  selector: CharacterDataSelector<TData>,
  shouldUpdate?: (prev: TData, next: TData) => boolean,
) {
  return useCharacterSheetSelector(selector, shouldUpdate)
}
