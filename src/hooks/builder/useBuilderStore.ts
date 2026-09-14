import { useContext } from "react"

import { BuilderStoreContext } from "#/contexts/builder/builderStore.context.ts"
import type { BuilderStore } from "#/state/builder/builderStore.ts"
import { OutOfContextError } from "#/utils/errors/outOfContextError.ts"

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
