import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { Draft } from "immer"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import { createGearApi } from "#/lib/gear/GearApi.ts"
import { GearContext } from "#/lib/gear/GearContext.tsx"
import type { ItemData } from "#/lib/system/types/ItemData.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

export const CharacterStoreContext =
  createContext<Store<PlayerCharacterData> | null>(null)

export interface CharacterStoreProviderProps extends PropsWithChildren {
  store: Store<PlayerCharacterData>
}

export const CharacterStoreProvider: FC<CharacterStoreProviderProps> = ({
  store,
  children,
}) => {
  const gearSlice = useStoreSlice<PlayerCharacterData, Record<string, ItemData>>(
    store,
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )

  const gearApi = useMemo(() => createGearApi(gearSlice), [gearSlice])

  return (
    <CharacterStoreContext.Provider value={store}>
      <GearContext.Provider value={gearApi}>
        {children}
      </GearContext.Provider>
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

export function useCharacterStoreSlice<TData extends object>(
  selector: CharacterDataSelector<TData>,
  setter: (
    state: Draft<PlayerCharacterData>,
    nextValue: TData,
  ) => Draft<PlayerCharacterData>,
): StoreSlice<TData> {
  const store = useCharacterStoreContext()
  return useStoreSlice<PlayerCharacterData, TData>(store, selector, setter)
}
