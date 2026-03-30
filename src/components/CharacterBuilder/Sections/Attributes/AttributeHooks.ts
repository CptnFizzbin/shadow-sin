import { createAttrInfo } from "#/components/Attributes/AttributeInfo.ts"
import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import {
  AttributeBpAllowance,
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/CharacterBuilder/Sections/Attributes/AttributeUtils.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import { AttributeKey, MentalAttributes, PhysicalAttributes, SpecialAttributes } from "#/lib/system/attributeKey.ts"
import { awakenings, MagicAwakeningTypes, TechAwakeningTypes } from "#/lib/system/awakeningType.ts"

export const useAttributesBuildPoints = () => {
  const activeAttributeCosts = useActiveAttributes()
    .map((attrData) => {
      let spent = 0
      spent += (attrData.value - attrData.min) * AttributeBpCostBase

      const isMaxedOut = attrData.value >= attrData.max
      if (isMaxedOut) {
        spent += AttributeBpCostMaxOut - AttributeBpCostBase
      }

      return { ...attrData, spent }
    })

  const physicalBpSpent = activeAttributeCosts
    .filter(({ attr }) => PhysicalAttributes.includes(attr))
    .reduce((sum, attr) => sum + attr.spent, 0)

  const mentalBpSpent = activeAttributeCosts
    .filter(({ attr }) => MentalAttributes.includes(attr))
    .reduce((sum, attr) => sum + attr.spent, 0)

  const specialBpSpent = activeAttributeCosts
    .filter(({ attr }) => SpecialAttributes.includes(attr))
    .reduce((sum, attr) => sum + attr.spent, 0)

  const totalBpSpent = physicalBpSpent + mentalBpSpent + specialBpSpent
  const budgetedBpSpent = physicalBpSpent + mentalBpSpent

  return {
    label: "Attributes",
    spent: totalBpSpent,
    physicalBp: physicalBpSpent,
    mentalBp: mentalBpSpent,
    specialBp: specialBpSpent,
    budget: {
      spent: budgetedBpSpent,
      remaining: AttributeBpAllowance - budgetedBpSpent,
      limit: AttributeBpAllowance,
    },
  }
}

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

export const useHasMaxxedAttribute = (): boolean => {
  return useActiveAttributes().some((attr) => attr.value >= attr.max)
}
