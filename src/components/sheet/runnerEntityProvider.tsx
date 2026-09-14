import type { FC, PropsWithChildren } from "react"

import { EntityProvider } from "#/contexts/entity/entity.provider.tsx"
import { useRunner } from "#/hooks/runner/useRunnerStore.ts"

/**
 * Reads the runner sheet's attribute values and provides them via `EntityProvider`, so
 * `useEntitySelector` resolves to the Runner by default for anything not nested under a more
 * specific `EntityProvider`.
 */
export const RunnerEntityProvider: FC<PropsWithChildren> = ({ children }) => {
  const runner = useRunner()

  return (
    <EntityProvider entity={runner}>
      {children}
    </EntityProvider>
  )
}
