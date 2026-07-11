import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { RunnerDataStore } from "./runnerDataStore.ts"

export const RunnerDataContext = createContext<RunnerDataStore | null>(null)

export const useRunnerDataContext = (): RunnerDataStore => {
  const store = useContext(RunnerDataContext)

  if (!store) {
    throw new OutOfContextError("useRunnerDataContext", "RunnerDataProvider")
  }

  return store
}
