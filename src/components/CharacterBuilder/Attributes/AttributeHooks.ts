import { getAttrData } from "#/components/Attributes/AttrData.ts"
import {
  AttributeBpAllowance,
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/CharacterBuilder/Attributes/AttributeUtils.ts"
import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { awakenings, MagicAwakeningTypes, TechAwakeningTypes } from "#/lib/system/awakeningType.ts"

export const useAttributesBuildPoints = () => {
  const totalBpSpent = useActiveAttributes()
    .map(({ value, min, max }) => {
      let spent = 0
      spent += (value - min) * AttributeBpCostBase

      const isMaxedOut = value >= max
      if (isMaxedOut) {
        spent += AttributeBpCostMaxOut - AttributeBpCostBase
      }

      return spent
    })
    .reduce((total, spent) => total + spent, 0)

  return {
    label: "Attributes",
    spent: totalBpSpent,
    allowance: AttributeBpAllowance,
    bpRemaining: AttributeBpAllowance - totalBpSpent,
  }
}

export const useActiveAttributes = () => {
  const attributes = useCharacterBuilderStore((sheet) => sheet.attributes)
  const metatype = useCharacterBuilderStore((sheet) => metatypes[sheet.metatype])
  const awakening = useCharacterBuilderStore((sheet) => awakenings[sheet.awakening])

  return Object.values(AttributeKey)
    .filter((attr) => {
      if (attr === AttributeKey.essence) return false
      if (attr === AttributeKey.magic) return MagicAwakeningTypes.includes(awakening.name)
      if (attr === AttributeKey.resonance) return TechAwakeningTypes.includes(awakening.name)
      return true
    })
    .map((attr) => ({ attr, value: attributes[attr].value }))
    .map(({ attr, value }) => getAttrData(attr, value, metatype, awakening))
}

export const useHasMaxxedAttribute = (): boolean => {
  return useActiveAttributes().some((attr) => attr.value >= attr.max)
}
