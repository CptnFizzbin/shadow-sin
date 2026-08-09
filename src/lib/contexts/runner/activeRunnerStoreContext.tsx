import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useState } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { RunnerStore } from "#/lib/stores/runner/runnerStore.ts"

interface ActiveRunnerStoreContextValue {
  activeStore: RunnerStore | null
  setActiveStore: (store: RunnerStore | null) => void
}

const ActiveRunnerStoreContext = createContext<ActiveRunnerStoreContextValue | null>(null)

/**
 * Tracks which `RunnerStore` (if any) belongs to the Runner currently being viewed, so app
 * chrome rendered outside the Runner route tree — e.g. `Header` — can display live data for
 * it. Renders once at the app root, above both the header and the routed `Outlet`.
 */
export const ActiveRunnerStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeStore, setActiveStore] = useState<RunnerStore | null>(null)

  return (
    <ActiveRunnerStoreContext.Provider value={{ activeStore, setActiveStore }}>
      {children}
    </ActiveRunnerStoreContext.Provider>
  )
}

export const useActiveRunnerStoreContext = (): ActiveRunnerStoreContextValue => {
  const value = useContext(ActiveRunnerStoreContext)

  if (!value) {
    throw new OutOfContextError("useActiveRunnerStoreContext", "ActiveRunnerStoreProvider")
  }

  return value
}
