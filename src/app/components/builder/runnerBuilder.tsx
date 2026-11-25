import type { FC } from "react"
import { use, useMemo } from "react"

import { ItemActionsDialogProvider } from "#/app/components/entities/items/actions/itemActionsDialogProvider.tsx"
import { AddItemDialogProvider } from "#/app/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { RunnerEntityProvider } from "#/app/components/runner/runnerEntityProvider.tsx"
import { toJsonValue } from "#/common/json/jsonUtils.ts"
import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import { RunnerStateProvider, createRunnerStateStore } from "#/state/runnerState.ts"
import { LocalStorageProvider } from "#/state/storage/providers/localStorageProvider.ts"

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
    return createRunnerStateStore({
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
    <RunnerStateProvider store={store}>
      <RunnerEntityProvider>
        <AddItemDialogProvider>
          <ItemActionsDialogProvider>
            <RunnerBuilderContent />
          </ItemActionsDialogProvider>
        </AddItemDialogProvider>
      </RunnerEntityProvider>
    </RunnerStateProvider>
  )
}
