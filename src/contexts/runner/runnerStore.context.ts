import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"

export const RunnerStoreContext = createContext<RunnerStore | null>(null)

export const useRunnerStoreContext = (): RunnerStore => {
  const store = useContext(RunnerStoreContext)

  if (!store) {
    throw new OutOfContextError("useRunnerStoreContext", "RunnerStoreProvider")
  }

  return store
}
