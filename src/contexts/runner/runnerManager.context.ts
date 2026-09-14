import { createContext } from "react"

import type { RunnerManager } from "#/services/persistence/runnerManager.ts"

export const RunnerManagerContext = createContext<RunnerManager | null>(null)
