import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { CharacterSheetProvider } from "#/components/Character/CharacterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/Character/CharacterSheetStore.ts"
import type { BuilderRootState } from "#/components/CharacterBuilder/BuilderRootState.ts"
import { BuilderStateStore } from "#/components/CharacterBuilder/BuilderStateStore.ts"
import { createSliceAtom } from "#/integrations/tanstack-store/AtomUtils.ts"

export const CharacterBuilderContext =
  createContext<BuilderStateStore | null>(null)

export interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
  rootStore: Store<BuilderRootState>
}

export const CharacterBuilderStoreProvider: FC<CharacterBuilderStoreProviderProps> = ({
  rootStore,
  children,
}) => {
  const characterSheetStore = useMemo((): CharacterSheetStore => {
    return new CharacterSheetStore(createSliceAtom(
      rootStore,
      (root) => root.character,
      (root, character) => ({ ...root, character }),
    ))
  }, [rootStore])

  const builderStateStore = useMemo((): BuilderStateStore => {
    return new BuilderStateStore(createSliceAtom(
      rootStore,
      (root) => root.builder,
      (root, builder) => ({ ...root, builder }),
    ))
  }, [rootStore])

  return (
    <CharacterBuilderContext.Provider value={builderStateStore}>
      <CharacterSheetProvider store={characterSheetStore}>
        {children}
      </CharacterSheetProvider>
    </CharacterBuilderContext.Provider>
  )
}

export const useCharacterBuilderStoreContext = (): BuilderStateStore => {
  const store = useContext(CharacterBuilderContext)

  if (!store) {
    throw new Error(
      "useCharacterBuilderStoreContext must be used within a CharacterBuilderStoreProvider",
    )
  }

  return store
}
