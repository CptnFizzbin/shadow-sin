import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import { AttributesProvider } from "#/lib/contexts/runner/attributesProvider.tsx"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

/**
 * Reads attribute data from the runner sheet and provides it via
 * `AttributesProvider` so that `useAttrValue` / `useAttrInfo` work without
 * any additional wiring.
 */
export const RunnerAttributesProvider: FC<PropsWithChildren> = ({ children }) => {
  const metatype = useRunnerStoreSelector((sheet) => metatypes[sheet.biology.metatype])
  const awakening = useRunnerStoreSelector((sheet) => awakenings[sheet.biology.awakening])
  const values = useRunnerStoreSelector((sheet) => sheet.attributes)

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
