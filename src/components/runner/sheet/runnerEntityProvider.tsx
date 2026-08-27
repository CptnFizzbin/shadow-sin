import type { FC, PropsWithChildren } from "react"

import { EntityProvider } from "#/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

/**
 * Reads the runner sheet's attribute values and provides them via `EntityProvider`, so
 * `useEntitySelector` resolves to the Runner by default for anything not nested under a more
 * specific `EntityProvider`.
 */
export const RunnerEntityProvider: FC<PropsWithChildren> = ({ children }) => {
  const attributes = useRunnerSelector(AttrSelectors.selectAll)

  return (
    <EntityProvider entity={{ attributes }}>
      {children}
    </EntityProvider>
  )
}
