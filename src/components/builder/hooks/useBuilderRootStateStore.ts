import { Store } from "@tanstack/store"
import { useCallback, useEffect, useState } from "react"

import type { BuilderRootState } from "#/components/builder/builderRootState.ts"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { mergeObjects } from "#/lib/mergeUtils.ts"
import type { JsonValue } from "#/lib/storage/asyncStorage.ts"
import { fromJsonValue, toJsonValue } from "#/lib/storage/asyncStorage.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

type UseBuilderRootStateStore = [
  store: Store<BuilderRootState>,
  reset: () => void,
  loadCharacter: (importedCharacter: CharacterSheet) => void,
]

const builderStorage = LocalStorageProvider.getStorage().namespace("builder")

function getBuilderKey(characterId: string): string {
  return `character-form/${characterId}`
}

export const useBuilderRootStateStore = (
  character?: CharacterSheet,
): UseBuilderRootStateStore => {
  const defaultBuilderValues: BuilderRootState = {
    character: character || createDefaultCharacterSheet(),
    builder: {
      startingNuyen: undefined,
    },
  }

  const storageKey = getBuilderKey(character?.id ?? "new")

  const [store] = useState(() => new Store<BuilderRootState>(defaultBuilderValues))

  // Load persisted state asynchronously on mount
  useEffect(() => {
    let cancelled = false
    builderStorage.getJson<JsonValue>(storageKey).then((saved) => {
      if (!cancelled && saved) {
        store.setState(() => mergeObjects<BuilderRootState>(defaultBuilderValues, fromJsonValue<BuilderRootState>(saved)))
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- storageKey is stable per character; store is stable for the lifetime of this component instance
  }, [storageKey])

  // Persist state on every change
  useEffect(() => {
    const { unsubscribe } = store.subscribe((state) => {
      void builderStorage.setJson(storageKey, toJsonValue(state))
    })
    return () => unsubscribe()
  }, [store, storageKey])

  const onReset = useCallback(() => {
    void builderStorage.removeItem(storageKey)
    store.setState(() => defaultBuilderValues)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- defaultBuilderValues is recomputed each render but its deep values are stable for a given character instance
  }, [store, storageKey])

  const loadCharacter = useCallback((importedCharacter: CharacterSheet) => {
    void builderStorage.removeItem(storageKey)
    store.setState(() => ({
      character: importedCharacter,
      builder: { startingNuyen: undefined },
    }))
  }, [store, storageKey])

  return [store, onReset, loadCharacter]
}
