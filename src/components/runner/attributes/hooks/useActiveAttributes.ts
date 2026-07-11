import { createAttrInfo } from "#/components/runner/attributes/attributeInfo.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { awakenings, MagicAwakeningTypes, TechAwakeningTypes } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

export const useActiveAttributes = () => {
  const attributes = useRunnerData((sheet) => sheet.attributes)
  const metatype = useRunnerData((sheet) => metatypes[sheet.biology.metatype])
  const awakening = useRunnerData((sheet) => awakenings[sheet.biology.awakening])

  return Object.values(AttributeKey)
    .filter((attr) => {
      if (attr === AttributeKey.essence) return false
      if (attr === AttributeKey.magic) return MagicAwakeningTypes.includes(awakening.name)
      if (attr === AttributeKey.resonance) return TechAwakeningTypes.includes(awakening.name)
      return true
    })
    .map((attr) => ({ attr, value: attributes[attr] }))
    .map(({ attr, value }) => createAttrInfo({ attr, value, metatype, awakening }))
}
