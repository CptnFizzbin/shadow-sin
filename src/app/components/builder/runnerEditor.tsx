import type { FC } from "react"
import { useMemo } from "react"

import { ItemActionsDialogProvider } from "#/app/components/entities/items/actions/itemActionsDialogProvider.tsx"
import { AddItemDialogProvider } from "#/app/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { RunnerEntityProvider } from "#/app/components/runner/runnerEntityProvider.tsx"
import { toJsonValue } from "#/common/json/jsonUtils.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import { RunnerStateProvider, createRunnerStateStore } from "#/state/runnerState.ts"
import { LocalStorageProvider } from "#/state/storage/providers/localStorageProvider.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"

import { RunnerEditorContent } from "./runnerEditorContent.tsx"

const runnerStorage = LocalStorageProvider.getStorage()

interface RunnerEditorProps {
  runner: RunnerData
}

export const RunnerEditor: FC<RunnerEditorProps> = ({ runner }) => {
  const store = useMemo(() => {
    return createRunnerStateStore({
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
    <RunnerStateProvider store={store}>
      <RunnerEntityProvider>
        <AddItemDialogProvider>
          <ItemActionsDialogProvider>
            <RunnerEditorContent />
          </ItemActionsDialogProvider>
        </AddItemDialogProvider>
      </RunnerEntityProvider>
    </RunnerStateProvider>
  )
}
