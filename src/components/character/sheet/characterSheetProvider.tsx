import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import { AttributesProvider } from "#/components/character/attributes/attributesProvider.tsx"
import { awakenings } from "#/system/awakeningType.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { metatypes } from "#/system/metatypeData.ts"

// eslint-disable-next-line import-x/no-cycle
import { useCharacterSheetSelector } from "./characterSheet.selectors.ts"
import type { CharacterSheetStore } from "./characterSheetStore.ts"

const CharacterSheetContext = createContext<CharacterSheetStore | null>(null)

interface CharacterSheetProviderProps extends PropsWithChildren {
  store: CharacterSheetStore
}

/**
 * Reads attribute data from the character sheet and provides it via
 * `AttributesProvider` so that `useAttrValue` / `useAttrInfo` work without
 * any additional wiring.
 */
const CharacterAttributesProvider: FC<PropsWithChildren> = ({ children }) => {
  const metatype = useCharacterSheet((sheet) => metatypes[sheet.biology.metatype])
  const awakening = useCharacterSheet((sheet) => awakenings[sheet.biology.awakening])
  const values = useCharacterSheet((sheet) => sheet.attributes)

  const infos = {
    ...metatype.attributes,
    ...awakening.attributes,
  }

  return (
    <AttributesProvider values={values} infos={infos}>
      {children}
    </AttributesProvider>
  )
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
