import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { RootStore } from "#/lib/stores/root/rootStore.ts"

export const RootStoreContext = createContext<RootStore | null>(null)

export const useRootStoreContext = (): RootStore => {
  const store = useContext(RootStoreContext)

  if (!store) {
    throw new OutOfContextError("useRootStoreContext", "RunnerStoreProvider")
  }

  return store
}
