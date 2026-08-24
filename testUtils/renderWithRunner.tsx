import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory, type RunnerFactoryAfterBuildFn } from "#/system/runnerData.factory.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { FC, PropsWithChildren } from "react"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { render } from "@testing-library/react"
import { ExportRunnerButton } from "#/components/runner/exportImport/exportRunnerButton.tsx"

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
