import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext } from "react"

import { useCharacterSheetContext } from "#/components/Character/Hooks/UseCharacterSheetContext.tsx"
import { GearProvider } from "#/components/Gear/GearProvider.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const CharacterSheetContext =
  createContext<Store<CharacterSheet> | null>(null)

export interface CharacterSheetProviderProps extends PropsWithChildren {
  store: Store<CharacterSheet>
}

export const CharacterSheetProvider: FC<CharacterSheetProviderProps> = ({
  store,
  children,
}) => {
  return (
    <CharacterSheetContext.Provider value={store}>
      <GearProvider>
        {children}
      </GearProvider>
    </CharacterSheetContext.Provider>
  )
}

type CharacterDataSelector<TData> = (state: CharacterSheet) => TData

/** @deprecated use {@link useCharacterSheet} instead. */
export function useCharacterStore<TData>(
  selector: CharacterDataSelector<TData>,
): TData {
  return useCharacterSheetStore(selector)
}

export function useCharacterSheet<TData>(selector: CharacterDataSelector<TData>) {
  const store = useCharacterSheetContext()
  return useStore(store, selector)
}

/** @deprecated use {@link useCharacterSheet} instead. */
export function useCharacterSheetStore<TData>(
  selector: CharacterDataSelector<TData>,
): TData {
  return useCharacterSheet(selector)
}
