import type { FC, PropsWithChildren } from "react"

import type { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { BuilderStoreContext } from "#/lib/contexts/builder/builderStore.context.ts"
import type { BuilderStore } from "#/lib/stores/builder/builderStore.ts"

interface RunnerBuilderStoreProviderProps extends PropsWithChildren {
  runnerStore: RunnerDataStore
  builderStore: BuilderStore
}

export const BuilderStoreProvider: FC<RunnerBuilderStoreProviderProps> = ({
  runnerStore,
  builderStore,
  children,
}) => {
  return (
    <BuilderStoreContext.Provider value={builderStore}>
      <RunnerStoreProvider store={runnerStore}>
        {children}
      </RunnerStoreProvider>
    </BuilderStoreContext.Provider>
  )
}
