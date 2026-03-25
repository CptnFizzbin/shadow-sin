import type { FC, PropsWithChildren } from "react"

import type { BuilderState } from "#/components/CharacterBuilder/BuilderState/BuilderState.ts"
import type { CharacterSheet } from "#/lib/system/types/characterSheet.ts"
import { BuilderStateProvider } from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import { createStore } from "@tanstack/store"

interface CharacterBuilderProviderProps extends PropsWithChildren {
  character?: CharacterSheet
  builderState: BuilderState
}

export const CharacterBuilderProvider: FC<CharacterBuilderProviderProps> = ({
  character,
  builderState,
  children,
}) => {
  const buildStateStore = createStore(builderState)
  const characterSheetStore = createStore(character ?? null)

  return {
    <BuilderStateProvider store={buildStateStore}>
      <CharacterSheetProvider store={character}>
      {children}
    </BuilderStateProvider>
  }
}
