import { useStore } from "@tanstack/react-store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { CharacterSheet } from "#/system/characterSheet.ts"

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
      {children}
    </CharacterSheetContext.Provider>
  )
}

type CharacterDataSelector<TData> = (state: CharacterSheet) => TData

export function useCharacterSheet<TData>(
  selector: CharacterDataSelector<TData>,
  compare?: (a: TData, b: TData) => boolean,
) {
  const store = useCharacterSheetContext()
  return useStore(store, selector, compare)
}

export const useCharacterSheetContext = (): CharacterSheetStore => {
  const store = useContext(CharacterSheetContext)

  if (!store) {
    throw new Error(
      "useCharacterSheetContext must be used within a CharacterSheetProvider",
    )
  }

  return store
}
