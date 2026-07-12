import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import { RunnerDataProvider } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { BuilderStoreContext, useBuilderDataContext } from "#/stores/builder/builderStore.context.ts"

import type { BuilderRootState } from "./builderRootState.ts"
import { BuilderStateStore } from "./builderStateStore.ts"
import { IsBuilderContext } from "./isBuilderContext.ts"

export { useBuilderDataContext }

interface RunnerBuilderStoreProviderProps extends PropsWithChildren {
  rootStore: Store<BuilderRootState>
}

export const RunnerBuilderStoreProvider: FC<RunnerBuilderStoreProviderProps> = ({
  rootStore,
  children,
}) => {
  const runnerDataStore = useMemo((): RunnerDataStore => {
    return new RunnerDataStore(createSliceAtom(
      rootStore,
      (root) => root.runner,
      (root, runner) => ({ ...root, runner }),
    ))
  }, [rootStore])

  const builderStateStore = useMemo((): BuilderStateStore => {
    return new BuilderStateStore(createSliceAtom(
      rootStore,
      (root) => root.builder,
      (root, builder) => ({ ...root, builder }),
    ))
  }, [rootStore])

  return (
    <IsBuilderContext.Provider value={true}>
      <BuilderStoreContext.Provider value={builderStateStore}>
        <RunnerDataProvider store={runnerDataStore}>
          {children}
        </RunnerDataProvider>
      </BuilderStoreContext.Provider>
    </IsBuilderContext.Provider>
  )
}
