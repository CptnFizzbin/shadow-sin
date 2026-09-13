import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { EditorModeProvider } from "#/contexts/builder/editorMode.tsx"
import { useBuilderStores } from "#/hooks/builder/useBuilderStores.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
        <RunnerBuilderContent reset={reset} loadRunner={loadRunner} onCancel={handleCancel} />
      </EditorModeProvider>
    </BuilderStoreProvider>
  )
}
