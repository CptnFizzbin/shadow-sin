import { Store } from "@tanstack/store"
import { use, useCallback, useEffect, useMemo, useState } from "react"

import type { BuilderRootState } from "#/components/builder/builderRootState.ts"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import type { JsonValue } from "#/lib/jsonUtils.ts"
import { toJsonValue } from "#/lib/jsonUtils.ts"
import { mergeObjects } from "#/lib/mergeUtils.ts"
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

function useSavedBuilderState(storageKey: string): BuilderRootState | null {
  const [promise] = useState(() => builderStorage.getItem<JsonValue>(storageKey).then((val) => val as BuilderRootState | null))
  return use(promise)
}

export const useBuilderRootStateStore = (
  character?: CharacterSheet,
): UseBuilderRootStateStore => {
  const storageKey = getBuilderKey(character?.id ?? "new")
  const savedState = useSavedBuilderState(storageKey)

  const defaultBuilderValues = useMemo(
    (): BuilderRootState => ({
      character: character || createDefaultCharacterSheet(),
      builder: {
        startingNuyen: undefined,
      },
    }),
    [character],
  )

  const [store] = useState(
    () =>
      new Store<BuilderRootState>(
        savedState ? mergeObjects<BuilderRootState>(defaultBuilderValues, savedState) : defaultBuilderValues,
      ),
  )

  useEffect(() => {
    const { unsubscribe } = store.subscribe((state) => {
      void builderStorage.setItem(storageKey, toJsonValue(state))
    })
    return () => unsubscribe()
  }, [store, storageKey])

  const onReset = useCallback(() => {
    void builderStorage.removeItem(storageKey)
    store.setState(() => defaultBuilderValues)
  }, [store, storageKey, defaultBuilderValues])

  const loadCharacter = useCallback(
    (importedCharacter: CharacterSheet) => {
      void builderStorage.removeItem(storageKey)
      store.setState(() => ({
        character: importedCharacter,
        builder: { startingNuyen: undefined },
      }))
    },
    [store, storageKey],
  )

  return [store, onReset, loadCharacter]
}
