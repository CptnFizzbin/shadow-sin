import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { BuilderStore } from "./builderStore.ts"

export const BuilderStoreContext = createContext<BuilderStore | null>(null)

export const useBuilderDataContext = (): BuilderStore => {
  const store = useContext(BuilderStoreContext)

  if (!store) {
    throw new OutOfContextError("useBuilderDataContext", "RunnerBuilderStoreProvider")
  }

  return store
}
