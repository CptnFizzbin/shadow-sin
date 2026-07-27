import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { BuilderStore } from "#/lib/stores/builder/builderStore.ts"

export const BuilderStoreContext = createContext<BuilderStore | null>(null)

export const useBuilderDataContext = (): BuilderStore => {
  const store = useContext(BuilderStoreContext)

  if (!store) {
    throw new OutOfContextError("useBuilderDataContext", "BuilderStoreProvider")
  }

  return store
}

export const useIsBuilder = (): boolean => {
  const store = useContext(BuilderStoreContext)
  return !!store
}
