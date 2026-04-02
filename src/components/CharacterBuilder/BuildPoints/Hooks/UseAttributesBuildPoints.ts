import { useActiveAttributes } from "#/components/Attributes/Hooks/UseActiveAttributes.ts"
import {
  AttributeBpAllowance,
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/CharacterBuilder/BuildPoints/AttributeUtils.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { MentalAttributes, PhysicalAttributes, SpecialAttributes } from "#/lib/system/attributeKey.ts"

export interface AttributesBuildPoints extends BpLineItem {
  physicalBp: number
  mentalBp: number
  specialBp: number
  budget: {
    spent: number
    remaining: number
    limit: number
  }
}

export const useAttributesBuildPoints = (): AttributesBuildPoints => {
  const activeAttributeCosts = useActiveAttributes()
    .map((attrData) => {
      let spent = 0
      spent += (attrData.value - attrData.min) * AttributeBpCostBase

      const isMaxedOut = attrData.max >= 1 && attrData.value >= attrData.max
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
    sectionId: BuilderSectionId.attributes,
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
