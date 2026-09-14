import type { FC, ReactNode } from "react"
import { useState } from "react"

import { RunnerManager } from "#/services/persistence/runnerManager.ts"
import { LocalStorageProvider } from "#/services/storage/providers/localStorageProvider.ts"

import { RunnerManagerContext } from "./runnerManager.context.ts"

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
