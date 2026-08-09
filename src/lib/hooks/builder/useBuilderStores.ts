import { use, useCallback, useEffect, useMemo } from "react"

import { builderStateFactory } from "#/components/builder/builderState.ts"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { scopeCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import type { JsonValue } from "#/lib/jsonUtils.ts"
import { toJsonValue } from "#/lib/jsonUtils.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { BuilderStore } from "#/lib/stores/builder/builderStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface UseBuilderRootStateStore {
  runnerStore: RunnerDataStore
  builderStore: BuilderStore
  reset: () => void
  loadRunner: (runner: RunnerData) => void
}

const runnerStorage = LocalStorageProvider.getStorage().namespace("builder")

function getRunnerStorageKey(runnerId: string): string {
  return `character-form/${runnerId}`
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
  const runnerStorageKey = getRunnerStorageKey(runner?.id ?? "new")
  const savedRunner = useSavedRunnerData(runnerStorageKey)

  const runnerStore = useMemo(() => {
    return new RunnerDataStore(runner || savedRunner || runnerDataFactory())
  }, [runner, savedRunner])

  const builderStore = useMemo(() => {
    return scopeCompatStore(runnerStore.root, "builder")
  }, [runnerStore])

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
