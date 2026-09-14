import { createContext } from "react"

import type { RunnerStore } from "#/state/runner/runnerStore.ts"

export const RunnerStoreContext = createContext<RunnerStore | null>(null)
