import type { FC, PropsWithChildren } from "react"

import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { BuilderStoreContext } from "#/lib/contexts/builder/builderStore.context.ts"
import type { BuilderStore } from "#/lib/stores/builder/builderStore.ts"
import type { RunnerStore } from "#/lib/stores/runner/runnerStore.ts"

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
      <RunnerStoreProvider store={runnerStore}>
        {children}
      </RunnerStoreProvider>
    </BuilderStoreContext.Provider>
  )
}
