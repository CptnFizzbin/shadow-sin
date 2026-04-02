import { createAttrInfo } from "#/components/Attributes/attribute-info.ts"
import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { awakenings, MagicAwakeningTypes, TechAwakeningTypes } from "#/lib/system/awakening-type.ts"
import { metatypes } from "#/lib/system/metatype-data.ts"

export const useActiveAttributes = () => {
  const attributes = useCharacterSheet((sheet) => sheet.attributes)
  const metatype = useCharacterSheet((sheet) => metatypes[sheet.biology.metatype])
  const awakening = useCharacterSheet((sheet) => awakenings[sheet.biology.awakening])

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
