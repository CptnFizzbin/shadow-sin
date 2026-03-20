import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
} from "react"
import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"

export const CharacterBuilderContext =
  createContext<Store<CharacterFormState> | null>(null)

export interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
  store: Store<CharacterFormState>
}

export const CharacterBuilderStoreProvider: FC<
  CharacterBuilderStoreProviderProps
> = ({ store, children }) => (
  <CharacterBuilderContext.Provider value={store}>
    {children}
  </CharacterBuilderContext.Provider>
)

export const useCharacterBuilderStoreContext =
  (): Store<CharacterFormState> => {
    const store = useContext(CharacterBuilderContext)

    if (!store) {
      throw new Error(
        "useCharacterBuilderStoreContext must be used within a CharacterBuilderStoreProvider",
      )
    }

    return store
  }

type CharacterBuilderSelector<TData> = (state: CharacterFormState) => TData

export function useCharacterBuilderStore<TData>(
  selector: CharacterBuilderSelector<TData>,
): TData {
  const store = useCharacterBuilderStoreContext()
  return useStore(store, selector)
}
