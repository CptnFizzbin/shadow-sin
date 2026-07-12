import { createContext, useContext } from "react"

import type { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

export const RunnerStoreContext = createContext<RunnerDataStore | null>(null)

export const useRunnerDataContext = (): RunnerDataStore => {
  const store = useContext(RunnerStoreContext)

  if (!store) {
    throw new OutOfContextError("useRunnerDataContext", "RunnerStoreProvider")
  }

  return store
}
