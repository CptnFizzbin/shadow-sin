import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"

import { CharacterSheetContext, useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import { GearProvider } from "#/components/Gear/GearProvider.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export interface CharacterSheetProviderProps extends PropsWithChildren {
  store: Store<CharacterSheet>
}

export const CharacterSheetProvider: FC<CharacterSheetProviderProps> = ({
  store,
  children,
}) => {
  return (
    <CharacterSheetContext.Provider value={store}>
      <GearProvider store={store}>
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
