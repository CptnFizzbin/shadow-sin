import type { FC, ReactNode } from "react"
import { useState } from "react"

import { LocalStorageProvider } from "#/state/storage/providers/localStorageProvider.ts"

import { RunnerManagerContext } from "./runnerManager.context.ts"
import { RunnerManager } from "./runnerManager.ts"

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
