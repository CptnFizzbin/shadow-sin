import { render } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"

import { RunnerDataStore } from "#/components/runner/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { ExportRunnerButton } from "#/components/system/exportImport/exportRunnerButton.tsx"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerFactoryAfterBuildFn } from "#/system/model/runnerData.factory.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

export function renderWithRunner(): RunnerDataStore
export function renderWithRunner(afterBuild: RunnerFactoryAfterBuildFn): RunnerDataStore
export function renderWithRunner(options: {
  items?: ItemCatalog
  afterBuild?: RunnerFactoryAfterBuildFn
}): RunnerDataStore
export function renderWithRunner(factoryArg?: {
  items?: ItemCatalog
  afterBuild?: RunnerFactoryAfterBuildFn
} | RunnerFactoryAfterBuildFn) {
  const runnerData = runnerDataFactory(
    typeof factoryArg === "function" ? { afterBuild: factoryArg } : factoryArg,
  )
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ExportRunnerButton />, { wrapper: Wrapper })

  return store
}
