import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import { AttributesProvider } from "#/lib/contexts/runner/attributesProvider.tsx"
import { selectAttributes } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { selectAwakeningData, selectMetatypeData } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

/**
 * Reads attribute data from the runner sheet and provides it via
 * `AttributesProvider` so that `useAttrValue` / `useAttrInfo` work without
 * any additional wiring.
 */
export const RunnerAttributesProvider: FC<PropsWithChildren> = ({ children }) => {
  const metatype = useRunnerStoreSelector(selectMetatypeData)
  const awakening = useRunnerStoreSelector(selectAwakeningData)
  const values = useRunnerStoreSelector(selectAttributes)

  const infos = useMemo(
    () => ({ ...metatype.attributes, ...awakening.attributes }),
    [metatype, awakening],
  )

  return (
    <AttributesProvider values={values} infos={infos}>
      {children}
    </AttributesProvider>
  )
}
