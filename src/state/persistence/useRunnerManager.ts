import { useContext } from "react"

import { RunnerManagerContext } from "./runnerManager.context.ts"
import type { RunnerManager } from "./runnerManager.ts"

export function useRunnerManager(): RunnerManager {
  const manager = useContext(RunnerManagerContext)
  if (!manager) {
    throw new Error("useRunnerManager must be used within a RunnerManagerProvider")
  }
  return manager
}
