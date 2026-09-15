import type { FC, PropsWithChildren } from "react"

import type { RunnerStateStore } from "#/state/runnerState.ts"
import { RunnerStateProvider } from "#/state/runnerState.ts"

import { RunnerEntityProvider } from "./runnerEntityProvider.tsx"

interface RunnerStoreProviderProps extends PropsWithChildren {
  store: RunnerStateStore
}

/**
 * Test-only convenience: nests the two Providers a rendered `RunnerState` store always needs —
 * `RunnerStateProvider` itself and `RunnerEntityProvider` (so `useRunnerSelector`/
 * `useEntitySelector`'s default-to-Runner fallback resolves). `store` is a real
 * `createRunnerStateStore(...)` instance built by the caller — same as production
 * (`RunnerBuilder`/`RunnerEditor`/the `$runnerId` route) — not a seed bridged into one.
 */
export const RunnerStoreProvider: FC<RunnerStoreProviderProps> = ({ store, children }) => (
  <RunnerStateProvider store={store}>
    <RunnerEntityProvider>
      {children}
    </RunnerEntityProvider>
  </RunnerStateProvider>
)
