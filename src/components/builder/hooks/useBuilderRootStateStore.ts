import { Store } from "@tanstack/store"
import { use, useCallback, useEffect, useMemo, useState } from "react"

import type { BuilderRootState } from "#/components/builder/builderRootState.ts"
import { createDefaultRunnerData } from "#/components/runner/sheet/createDefaultRunnerData.ts"
import type { JsonValue } from "#/lib/jsonUtils.ts"
import { toJsonValue } from "#/lib/jsonUtils.ts"
import { mergeObjects } from "#/lib/mergeUtils.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { RunnerData } from "#/system/runnerData.ts"

type UseBuilderRootStateStore = [
  store: Store<BuilderRootState>,
  reset: () => void,
  loadRunner: (importedRunner: RunnerData) => void,
]

const builderStorage = LocalStorageProvider.getStorage().namespace("builder")

function getBuilderKey(runnerId: string): string {
  return `character-form/${runnerId}`
}

function useSavedBuilderState(storageKey: string): BuilderRootState | null {
  const [promise] = useState(() => builderStorage.getItem<JsonValue>(storageKey).then((val) => val as BuilderRootState | null))
  return use(promise)
}

export const useBuilderRootStateStore = (
  runner?: RunnerData,
): UseBuilderRootStateStore => {
  const storageKey = getBuilderKey(runner?.id ?? "new")
  const savedState = useSavedBuilderState(storageKey)

  const defaultBuilderValues = useMemo(
    (): BuilderRootState => ({
      runner: runner || createDefaultRunnerData(),
      builder: {
        startingNuyen: undefined,
      },
    }),
    [runner],
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

  const loadRunner = useCallback(
    (importedRunner: RunnerData) => {
      void builderStorage.removeItem(storageKey)
      store.setState(() => ({
        runner: importedRunner,
        builder: { startingNuyen: undefined },
      }))
    },
    [store, storageKey],
  )

  return [store, onReset, loadRunner]
}
