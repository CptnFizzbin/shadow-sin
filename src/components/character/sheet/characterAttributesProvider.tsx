import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import { AttributesProvider } from "#/components/character/attributes/attributesProvider.tsx"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

import { useCharacterSheetSelector } from "./characterSheet.selectors.ts"

/**
 * Reads attribute data from the character sheet and provides it via
 * `AttributesProvider` so that `useAttrValue` / `useAttrInfo` work without
 * any additional wiring.
 */
export const CharacterAttributesProvider: FC<PropsWithChildren> = ({ children }) => {
  const metatype = useCharacterSheetSelector((sheet) => metatypes[sheet.biology.metatype])
  const awakening = useCharacterSheetSelector((sheet) => awakenings[sheet.biology.awakening])
  const values = useCharacterSheetSelector((sheet) => sheet.attributes)

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
