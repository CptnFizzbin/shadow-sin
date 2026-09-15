import type { FC } from "react"
import { use, useMemo } from "react"

import { AddItemDialogProvider } from "#/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { LocalStorageProvider } from "#/services/storage/providers/localStorageProvider.ts"
import { AppStateProvider, createRootStore } from "#/state/rootState.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { toJsonValue } from "#/utils/jsonUtils.ts"

import { RunnerBuilderContent } from "./runnerBuilderContent.tsx"

const runnerStorage = LocalStorageProvider.getStorage()

const STORAGE_KEY = "builder/new"

function useSavedRunnerData(): RunnerData {
  const promise = useMemo((): Promise<RunnerData> => {
    return new Promise((resolve) => {
      runnerStorage.getItem(STORAGE_KEY).then((val) => {
        resolve((val as RunnerData | null) ?? runnerDataFactory())
      })
    })
  }, [])

  return use(promise)
}

export const RunnerBuilder: FC = () => {
  const savedRunner = useSavedRunnerData()

  const store = useMemo(() => {
    return createRootStore({
      mode: "builder",
      runner: savedRunner,
      onChange: async (state) => {
        try {
          await runnerStorage.setItem(STORAGE_KEY, toJsonValue(state))
        } catch (error) {
          console.error("Failed to save runner sheet.", error)
        }
      },
    })
  }, [savedRunner])

  return (
    <AppStateProvider store={store}>
      <AddItemDialogProvider>
        <RunnerBuilderContent />
      </AddItemDialogProvider>
    </AppStateProvider>
  )
}
