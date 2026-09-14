import { use, useCallback, useEffect, useMemo } from "react"

import { builderStateFactory } from "#/components/builder/builderState.ts"
import { RunnerDataStore } from "#/components/runner/runnerDataStore.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { getRunnerStorageKey } from "#/services/persistence/builderDraftKey.ts"
import { LocalStorageProvider } from "#/services/storage/providers/localStorageProvider.ts"
import { builderStoreReducer } from "#/state/builder/builderStore.reducer.ts"
import type { BuilderStore } from "#/state/builder/builderStore.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import type { JsonValue } from "#/utils/jsonUtils.ts"
import { toJsonValue } from "#/utils/jsonUtils.ts"

export interface UseBuilderRootStateStore {
  runnerStore: RunnerStore
  builderStore: BuilderStore
  reset: () => void
  loadRunner: (runner: RunnerData) => void
}

const runnerStorage = LocalStorageProvider.getStorage()

/**
 * Deletes the saved Builder draft at `runnerStorageKey`, leaving every other saved runner and
 * draft untouched. Used by `BuilderLoadErrorBoundary` to recover from a draft that was saved
 * under an older `RunnerData` shape and now crashes the Builder on load — drafts are never run
 * through `applyMigrations` (unlike saved runners; see `RunnerManager.getRunner`), so an old
 * draft is cast to the current type as-is instead of being upgraded to match it.
 */
export function clearSavedRunnerDraft(runnerStorageKey: string): Promise<void> {
  return runnerStorage.removeItem(runnerStorageKey)
}

async function getSavedRunner(runnerStorageKey: string) {
  const val = await runnerStorage.getItem<JsonValue>(runnerStorageKey)
  return val as RunnerData | null
}

function useSavedRunnerData(runnerStorageKey: string): RunnerData | null {
  const promise = useMemo((): Promise<RunnerData | null> => {
    return getSavedRunner(runnerStorageKey)
  }, [runnerStorageKey])

  return use(promise)
}

export const useBuilderStores = (
  runner?: RunnerData,
): UseBuilderRootStateStore => {
  const runnerStorageKey = getRunnerStorageKey(runner?.id)
  const savedRunner = useSavedRunnerData(runnerStorageKey)

  const runnerStore: RunnerStore = useMemo(() => {
    return new RunnerDataStore(runner || savedRunner || runnerDataFactory())
  }, [runner, savedRunner])

  const builderStore = useMemo(() => {
    return createCompatStore(builderStateFactory(), builderStoreReducer)
  }, [])

  useEffect(() => {
    const { unsubscribe } = runnerStore.subscribe((state) => {
      void runnerStorage.setItem(runnerStorageKey, toJsonValue(state))
    })
    return () => unsubscribe()
  }, [runnerStore, runnerStorageKey])

  const onReset = useCallback(() => {
    void runnerStorage.removeItem(runnerStorageKey)
    runnerStore.setState(() => runnerDataFactory())
    builderStore.setState(() => builderStateFactory())
  }, [runnerStorageKey, runnerStore, builderStore])

  const loadRunner = useCallback((importedRunner: RunnerData) => {
    void runnerStorage.removeItem(runnerStorageKey)
    runnerStore.setState(() => importedRunner)
    builderStore.setState(() => builderStateFactory())
  }, [runnerStorageKey, runnerStore, builderStore])

  return {
    runnerStore,
    builderStore,
    reset: onReset,
    loadRunner: loadRunner,
  }
}
