import type { FC, PropsWithChildren } from "react"

import { RunnerDataProvider } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { BuilderStoreContext, useBuilderDataContext } from "#/stores/builder/builderStore.context.ts"
import type { BuilderStore } from "#/stores/builder/builderStore.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"

export { useBuilderDataContext }

interface RunnerBuilderStoreProviderProps extends PropsWithChildren {
  runnerStore: RunnerStore
  builderStore: BuilderStore
}

export const BuilderStoreProvider: FC<RunnerBuilderStoreProviderProps> = ({
  runnerStore,
  builderStore,
  children,
}) => {
  return (
    <BuilderStoreContext.Provider value={builderStore}>
      <RunnerDataProvider store={runnerStore}>
        {children}
      </RunnerDataProvider>
    </BuilderStoreContext.Provider>
  )
}
