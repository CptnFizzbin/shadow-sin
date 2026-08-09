import { createAttrInfo } from "#/components/runner/attributes/attributeInfo.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey, AttributeOrder } from "#/system/attributeKey.ts"
import { MagicAwakeningTypes, TechAwakeningTypes } from "#/system/awakeningType.ts"

export const useActiveAttributes = () => {
  const attributes = useRunnerStoreSelector(Selectors.attributes.selectAttributes)
  const metatype = useRunnerStoreSelector(Selectors.biology.selectMetatypeData)
  const awakening = useRunnerStoreSelector(Selectors.biology.selectAwakeningData)

  // AttributeOrder — not Object.values(AttributeKey) — excludes the four Matrix stats, which
  // aren't Runner attribute rows (see #438).
  return AttributeOrder
    .filter((attr) => {
      if (attr === AttributeKey.essence) return false
      if (attr === AttributeKey.magic) return MagicAwakeningTypes.includes(awakening.name)
      if (attr === AttributeKey.resonance) return TechAwakeningTypes.includes(awakening.name)
      return true
    })
    .map((attr) => ({ attr, value: attributes[attr] ?? 0 }))
    .map(({ attr, value }) => createAttrInfo({ attr, value, metatype, awakening }))
}
