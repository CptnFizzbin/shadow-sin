import type { FC, PropsWithChildren } from "react"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { BuilderStoreContext } from "#/contexts/builder/builderStore.context.ts"
import type { BuilderStore } from "#/state/builder/builderStore.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"

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
