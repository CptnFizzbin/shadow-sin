import type { Store } from "@tanstack/store"
import { useCallback, useMemo } from "react"

import type { BuilderRootState } from "#/components/builder/builderRootState.ts"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { StorePersister, usePersistedStore } from "#/lib/storage/storePersister.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

type UseBuilderRootStateStore = [
  store: Store<BuilderRootState>,
  reset: () => void,
  loadCharacter: (importedCharacter: CharacterSheet) => void,
]

export const useBuilderRootStateStore = (
  character?: CharacterSheet,
): UseBuilderRootStateStore => {
  const defaultBuilderValues = useMemo((): BuilderRootState => ({
    character: character || createDefaultCharacterSheet(),
    builder: {
      startingNuyen: undefined,
    },
  }), [character])

  const storageKey = `builder:${character?.id ?? "new"}`
  const store = usePersistedStore(storageKey, defaultBuilderValues)

  const onReset = useCallback(() => {
    StorePersister.clearState(storageKey)
    store.setState(() => defaultBuilderValues)
  }, [store, storageKey, defaultBuilderValues])

  const loadCharacter = useCallback((importedCharacter: CharacterSheet) => {
    StorePersister.clearState(storageKey)
    store.setState(() => ({
      character: importedCharacter,
      builder: { startingNuyen: undefined },
    }))
  }, [store, storageKey])

  return [store, onReset, loadCharacter]
}
