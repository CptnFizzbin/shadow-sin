import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { CharacterSheetProvider } from "#/components/Character/character-sheet-provider.tsx"
import { CharacterSheetStore } from "#/components/Character/character-sheet-store.ts"
import type { BuilderRootState } from "#/components/CharacterBuilder/builder-root-state.ts"
import { BuilderStateStore } from "#/components/CharacterBuilder/builder-state-store.ts"
import { createSliceAtom } from "#/integrations/tanstack-store/atom-utils.ts"

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

export const useBuilderStore = (): BuilderStateStore => {
  const store = useContext(CharacterBuilderContext)

  if (!store) {
    throw new Error(
      "useCharacterBuilderStoreContext must be used within a CharacterBuilderStoreProvider",
    )
  }

  return store
}
