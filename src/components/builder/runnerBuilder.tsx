import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { AddItemDialogProvider } from "#/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { EditorModeProvider } from "#/contexts/builder/editorMode.tsx"
import { useBuilderStores } from "#/hooks/builder/useBuilderStores.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { BuilderStoreProvider } from "./builderStoreProvider.tsx"
import { RunnerBuilderContent } from "./runnerBuilderContent.tsx"

interface RunnerFormProps {
  runner?: RunnerData
}

export const RunnerBuilder: FC<RunnerFormProps> = ({ runner }) => {
  const { runnerStore, builderStore, reset, loadRunner } = useBuilderStores(runner)
  const navigate = useNavigate()

  const handleCancel = () => {
    if (runner) {
      navigate({ to: "/$runnerId/about", params: { runnerId: runner.id } })
    } else {
      navigate({ to: "/" })
    }
  }

  return (
    <BuilderStoreProvider runnerStore={runnerStore} builderStore={builderStore}>
      <EditorModeProvider mode="builder">
        <AddItemDialogProvider>
          <RunnerBuilderContent reset={reset} loadRunner={loadRunner} onCancel={handleCancel} />
        </AddItemDialogProvider>
      </EditorModeProvider>
    </BuilderStoreProvider>
  )
}
