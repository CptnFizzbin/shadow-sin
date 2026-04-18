import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { IsBuilderContext } from "#/components/character/isBuilderContext.ts"
import type { BuilderRootState } from "#/components/characterBuilder/builderRootState.ts"
import { BuilderStateStore } from "#/components/characterBuilder/builderStateStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

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
    <IsBuilderContext.Provider value={true}>
      <CharacterBuilderContext.Provider value={builderStateStore}>
        <CharacterSheetProvider store={characterSheetStore}>
          {children}
        </CharacterSheetProvider>
      </CharacterBuilderContext.Provider>
    </IsBuilderContext.Provider>
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
