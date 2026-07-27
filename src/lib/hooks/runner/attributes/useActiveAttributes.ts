import { createAttrInfo } from "#/components/runner/attributes/attributeInfo.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { MagicAwakeningTypes, TechAwakeningTypes } from "#/system/awakeningType.ts"

export const useActiveAttributes = () => {
  const attributes = useRunnerStoreSelector(Selectors.attributes.selectAttributes)
  const metatype = useRunnerStoreSelector(Selectors.biology.selectMetatypeData)
  const awakening = useRunnerStoreSelector(Selectors.biology.selectAwakeningData)

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
