import { createStore } from "@tanstack/store"
import { use, useCallback, useEffect, useMemo } from "react"

import type { BuilderState } from "#/components/builder/builderState.ts"
import { builderStateFactory } from "#/components/builder/builderState.ts"
import type { JsonValue } from "#/lib/jsonUtils.ts"
import { toJsonValue } from "#/lib/jsonUtils.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { BuilderStore } from "#/stores/builder/builderStore.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface UseBuilderRootStateStore {
  runnerStore: RunnerStore
  builderStore: BuilderStore
  reset: () => void
  loadRunner: (runner: RunnerData) => void
}

const builderStorage = LocalStorageProvider.getStorage().namespace("builder")

function getBuilderKey(runnerId: string): string {
  return `character-form/${runnerId}`
}

async function getSavedBuilder(runnerStorageKey: string) {
  const val = await builderStorage.getItem<JsonValue>(runnerStorageKey)
  return val as RunnerData | null
}

function useSavedRunnerData(runnerStorageKey: string): RunnerData | null {
  const promise = useMemo((): Promise<RunnerData | null> => {
    return getSavedBuilder(runnerStorageKey)
  }, [runnerStorageKey])

  return use(promise)
}

export const useBuilderStores = (
  runner?: RunnerData,
): UseBuilderRootStateStore => {
  const runnerStorageKey = getBuilderKey(runner?.id ?? "new")
  const savedRunner = useSavedRunnerData(runnerStorageKey)

  const runnerStore = useMemo(() => {
    return createStore<RunnerData>(runner || savedRunner || runnerDataFactory())
  }, [runner, savedRunner])

  const builderStore = useMemo(() => {
    return createStore<BuilderState>(builderStateFactory())
  }, [])

  useEffect(() => {
    const { unsubscribe } = runnerStore.subscribe((state) => {
      void builderStorage.setItem(runnerStorageKey, toJsonValue(state))
    })
    return () => unsubscribe()
  }, [runnerStore, runnerStorageKey])

  const onReset = useCallback(() => {
    void builderStorage.removeItem(runnerStorageKey)
    runnerStore.setState(() => runnerDataFactory())
    builderStore.setState(() => builderStateFactory())
  }, [runnerStorageKey, runnerStore, builderStore])

  const loadRunner = useCallback((importedRunner: RunnerData) => {
    void builderStorage.removeItem(runnerStorageKey)
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
