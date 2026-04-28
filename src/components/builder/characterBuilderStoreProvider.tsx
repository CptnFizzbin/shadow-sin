import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useMemo } from "react"

import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import type { BuilderRootState } from "./builderRootState.ts"
import { BuilderStateStore } from "./builderStateStore.ts"
import { IsBuilderContext } from "./isBuilderContext.ts"

const CharacterBuilderContext =
  createContext<BuilderStateStore | null>(null)

interface CharacterBuilderStoreProviderProps extends PropsWithChildren {
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
