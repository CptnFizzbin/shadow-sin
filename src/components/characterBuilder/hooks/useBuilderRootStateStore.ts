import type { Store } from "@tanstack/store"
import { useCallback, useMemo } from "react"

import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import type { BuilderRootState } from "#/components/characterBuilder/builderRootState.ts"
import { StorePersister, usePersistedStore } from "#/lib/storage/storePersister.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export type UseBuilderRootStateStore = [
  store: Store<BuilderRootState>,
  reset: () => void,
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

  return [store, onReset]
}
