import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import { GearProvider } from "#/components/Gear/GearProvider.tsx"

export const CharacterBuilderContext =
  createContext<Store<CharacterBuilderState> | null>(null)

export interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
  store: Store<CharacterBuilderState>
}

export const CharacterBuilderStoreProvider: FC<
  CharacterBuilderStoreProviderProps
> = ({ store, children }) => (
  <CharacterBuilderContext.Provider value={store}>
    <GearProvider store={store}>
      {children}
    </GearProvider>
  </CharacterBuilderContext.Provider>
)

export const useCharacterBuilderStoreContext =
  (): Store<CharacterBuilderState> => {
    const store = useContext(CharacterBuilderContext)

    if (!store) {
      throw new Error(
        "useCharacterBuilderStoreContext must be used within a CharacterBuilderStoreProvider",
      )
    }

    return store
  }

type CharacterBuilderSelector<TData> = (state: CharacterBuilderState) => TData

export function useCharacterBuilderStore<TData>(
  selector: CharacterBuilderSelector<TData>,
): TData {
  const store = useCharacterBuilderStoreContext()
  return useStore(store, selector)
}
