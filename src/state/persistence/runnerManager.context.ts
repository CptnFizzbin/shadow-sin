import { createContext } from "react"

import type { RunnerManager } from "./runnerManager.ts"

export const RunnerManagerContext = createContext<RunnerManager | null>(null)
