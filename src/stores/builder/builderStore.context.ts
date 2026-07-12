import { createContext, useContext } from "react"

import type { BuilderStateStore } from "#/components/builder/builderStateStore.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

export const BuilderStoreContext = createContext<BuilderStateStore | null>(null)

export const useBuilderDataContext = (): BuilderStateStore => {
  const store = useContext(BuilderStoreContext)

  if (!store) {
    throw new OutOfContextError("useBuilderDataContext", "RunnerBuilderStoreProvider")
  }

  return store
}
