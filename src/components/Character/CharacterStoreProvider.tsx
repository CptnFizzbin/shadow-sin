import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import { GearProvider } from "#/components/Gear/GearProvider.tsx"
import type { PlayerCharacterData } from "#/lib/system/playerCharacterData.ts"

export const CharacterStoreContext =
  createContext<Store<PlayerCharacterData> | null>(null)

export interface CharacterStoreProviderProps extends PropsWithChildren {
  store: Store<PlayerCharacterData>
}

export const CharacterStoreProvider: FC<CharacterStoreProviderProps> = ({
  store,
  children,
}) => {
  return (
    <CharacterStoreContext.Provider value={store}>
      <GearProvider store={store}>
        {children}
      </GearProvider>
    </CharacterStoreContext.Provider>
  )
}

type CharacterDataSelector<TData> = (state: PlayerCharacterData) => TData

export const useCharacterStoreContext = (): Store<PlayerCharacterData> => {
  const store = useContext(CharacterStoreContext)

  if (!store) {
    throw new Error(
      "useCharacterStoreContext must be used within a CharacterStoreProvider",
    )
  }

  return store
}

export function useCharacterStore<TData>(
  selector: CharacterDataSelector<TData>,
): TData {
  const store = useCharacterStoreContext()
  return useStore(store, selector)
}

export function useCharacterSheet() {
  return useCharacterStoreContext()
}

export function useCharacterSheetStore<TData>(
  selector: CharacterDataSelector<TData>,
): TData {
  const store = useCharacterSheet()
  return useStore(store, selector)
}
