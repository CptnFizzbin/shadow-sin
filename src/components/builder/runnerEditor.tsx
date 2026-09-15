import type { FC } from "react"
import { useMemo } from "react"

import { AddItemDialogProvider } from "#/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { RunnerEntityProvider } from "#/components/runner/runnerEntityProvider.tsx"
import { LocalStorageProvider } from "#/services/storage/providers/localStorageProvider.ts"
import { AppStateProvider, createRootStore } from "#/state/rootState.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { toJsonValue } from "#/utils/jsonUtils.ts"

import { RunnerEditorContent } from "./runnerEditorContent.tsx"

const runnerStorage = LocalStorageProvider.getStorage()

interface RunnerEditorProps {
  runner: RunnerData
}

export const RunnerEditor: FC<RunnerEditorProps> = ({ runner }) => {
  const store = useMemo(() => {
    return createRootStore({
      mode: "editor",
      runner: runner,
      onChange: async (state) => {
        try {
          const data: RunnerData = toRunnerData(state)
          await runnerStorage.setItem(`editor/${runner.id}`, toJsonValue(data))
        } catch (error) {
          console.error("Failed to save runner sheet.", error)
        }
      },
    })
  }, [runner])

  return (
    <AppStateProvider store={store}>
      <RunnerEntityProvider>
        <AddItemDialogProvider>
          <RunnerEditorContent />
        </AddItemDialogProvider>
      </RunnerEntityProvider>
    </AppStateProvider>
  )
}
