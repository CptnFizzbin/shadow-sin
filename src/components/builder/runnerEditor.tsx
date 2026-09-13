import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { EditorModeProvider } from "#/contexts/builder/editorMode.tsx"
import { useBuilderStores } from "#/hooks/builder/useBuilderStores.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { BuilderStoreProvider } from "./builderStoreProvider.tsx"
import { RunnerEditorContent } from "./runnerEditorContent.tsx"

interface RunnerEditorProps {
  runner: RunnerData
}

export const RunnerEditor: FC<RunnerEditorProps> = ({ runner }) => {
  const { runnerStore, builderStore, loadRunner } = useBuilderStores(runner)
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate({ to: "/$runnerId/about", params: { runnerId: runner.id } })
  }

  const handleRevert = () => {
    runnerStore.setState(() => runner)
  }

  return (
    <BuilderStoreProvider runnerStore={runnerStore} builderStore={builderStore}>
      <EditorModeProvider mode="edit">
        <RunnerEditorContent onCancel={handleCancel} onImport={loadRunner} onRevert={handleRevert} />
      </EditorModeProvider>
    </BuilderStoreProvider>
  )
}
