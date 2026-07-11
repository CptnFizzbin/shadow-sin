import type { FC, ReactNode } from "react"
import { createContext, useContext, useState } from "react"

import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"

import { RunnerManager } from "./runnerManager.ts"

const RunnerManagerContext = createContext<RunnerManager | null>(null)

interface RunnerManagerProviderProps {
  children: ReactNode
  manager?: RunnerManager
}

export const RunnerManagerProvider: FC<RunnerManagerProviderProps> = ({ children, manager: managerProp }) => {
  const [manager] = useState(
    () => managerProp ?? new RunnerManager({ local: LocalStorageProvider.getStorage() }),
  )

  return (
    <RunnerManagerContext.Provider value={manager}>
      {children}
    </RunnerManagerContext.Provider>
  )
}

export function useRunnerManager(): RunnerManager {
  const manager = useContext(RunnerManagerContext)
  if (!manager) {
    throw new Error("useRunnerManager must be used within a RunnerManagerProvider")
  }
  return manager
}
