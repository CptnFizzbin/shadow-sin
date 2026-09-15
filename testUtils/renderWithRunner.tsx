import { render } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { ExportRunnerButton } from "#/components/system/exportImport/exportRunnerButton.tsx"
import type { RunnerStateStore } from "#/state/runnerState.ts"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerFactoryAfterBuildFn } from "#/system/model/runnerData.factory.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

export function renderWithRunner(): RunnerStateStore
export function renderWithRunner(afterBuild: RunnerFactoryAfterBuildFn): RunnerStateStore
export function renderWithRunner(options: {
  items?: ItemCatalog
  afterBuild?: RunnerFactoryAfterBuildFn
}): RunnerStateStore
export function renderWithRunner(factoryArg?: {
  items?: ItemCatalog
  afterBuild?: RunnerFactoryAfterBuildFn
} | RunnerFactoryAfterBuildFn) {
  const runnerData = runnerDataFactory(
    typeof factoryArg === "function" ? { afterBuild: factoryArg } : factoryArg,
  )
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ExportRunnerButton />, { wrapper: Wrapper })

  return store
}
