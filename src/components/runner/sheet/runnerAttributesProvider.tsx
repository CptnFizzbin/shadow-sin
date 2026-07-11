import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import { AttributesProvider } from "#/components/runner/attributes/attributesProvider.tsx"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

import { useRunnerDataSelector } from "./runnerData.selectors.ts"

/**
 * Reads attribute data from the runner sheet and provides it via
 * `AttributesProvider` so that `useAttrValue` / `useAttrInfo` work without
 * any additional wiring.
 */
export const RunnerAttributesProvider: FC<PropsWithChildren> = ({ children }) => {
  const metatype = useRunnerDataSelector((sheet) => metatypes[sheet.biology.metatype])
  const awakening = useRunnerDataSelector((sheet) => awakenings[sheet.biology.awakening])
  const values = useRunnerDataSelector((sheet) => sheet.attributes)

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
