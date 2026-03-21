import { attrPointCosts } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { contactBuildPoints } from "#/components/Character/Form/Contacts/UseContactsFormGroup.ts"
import { GearBpAllowance } from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import { qualityBuildPoints } from "#/components/Character/Form/Qualities/QualitiesSection.tsx"
import {
  calculateComplexFormsBp,
  calculateSpritesBp,
} from "#/components/Character/Form/Resources/Technomancer/TechnomancerRequirements.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import { metatypes } from "#/lib/system/types/MetatypeData.ts"
import { awakenings } from "#/lib/system/types/awakeningType.ts"

export interface BpLineItem {
  label: string
  spent: number
  allowance?: number
  isOver: boolean
}

export interface BpSummary {
  total: number
  spent: number
  remaining: number
  isOverBudget: boolean
  lineItems: BpLineItem[]
  warnings: string[]
}

export function useBuildPointsSummary(): BpSummary {
  const metatypeKey = useCharacterBuilderStore((state) => state.metatype)
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)
  const qualities = useCharacterBuilderStore((state) => state.qualities)
  const attributesBpSpent = useCharacterBuilderStore(
    (state) => state.buildPoints.spent.attributes,
  )
  const activeSkills = useCharacterBuilderStore((s) => s.skills.activeSkills)
  const activeSkillGroups = useCharacterBuilderStore(
    (s) => s.skills.activeSkillGroups,
  )
  const knowledgeSkills = useCharacterBuilderStore(
    (s) => s.skills.knowledgeSkills,
  )
  const languageSkills = useCharacterBuilderStore(
    (state) => state.skills.languageSkills,
  )
  const logicValue = useCharacterBuilderStore((s) => s.attributes.logic.value)
  const intuitionValue = useCharacterBuilderStore(
    (s) => s.attributes.intuition.value,
  )
  const gearBpSpent = useCharacterBuilderStore(
    (state) => state.buildPoints.spent.gear,
  )
  const contacts = useCharacterBuilderStore((state) => state.contacts)

  const contactsBpSpent = contactBuildPoints(contacts)
  const complexForms = useCharacterBuilderStore(
    (state) => state.awakened.complexForms,
  )
  const sprites = useCharacterBuilderStore((state) => state.awakened.sprites)

  const metatypeCost = metatypes[metatypeKey].cost
  const awakeningCost = awakenings[awakeningType].cost
  const biologyBpSpent = metatypeCost + awakeningCost

  let positiveQualitiesBp = 0
  let negativeQualitiesBp = 0

  for (const quality of qualities) {
    if (quality.type === "positive") {
      positiveQualitiesBp += quality.bpValue ?? 0
    } else {
      negativeQualitiesBp += quality.bpValue ?? 0
    }
  }

  const qualitiesNetBp = positiveQualitiesBp - negativeQualitiesBp

  // Calculate skills BP dynamically from skills arrays
  const activeSkillsBp = calculateActiveSkillsBp(
    activeSkills,
    activeSkillGroups,
  )
  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    knowledgeSkills,
    languageSkills,
  )
  const freeSkillPoints = getFreeSkillPoints(logicValue, intuitionValue)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)
  const skillsBpSpent = activeSkillsBp + extraSpBp

  const complexFormsBpSpent = calculateComplexFormsBp(complexForms)
  const spritesBpSpent = calculateSpritesBp(sprites)
  const awakenedBpSpent = complexFormsBpSpent + spritesBpSpent

  const totalBuildPoints = useCharacterBuilderStore(
    (state) => state.buildPoints.total,
  )

  const totalSpent =
    biologyBpSpent +
    qualitiesNetBp +
    attributesBpSpent +
    skillsBpSpent +
    awakenedBpSpent +
    gearBpSpent +
    contactsBpSpent

  const remaining = totalBuildPoints - totalSpent

  const warnings: string[] = []

  if (attributesBpSpent > attrPointCosts.allowance) {
    warnings.push(
      `Attributes exceed the ${attrPointCosts.allowance} BP allowance`,
    )
  }

  if (positiveQualitiesBp > qualityBuildPoints.allowance.positive) {
    warnings.push(
      `Positive qualities exceed the ${qualityBuildPoints.allowance.positive} BP allowance`,
    )
  }

  if (negativeQualitiesBp > qualityBuildPoints.allowance.negative) {
    warnings.push(
      `Negative qualities exceed the ${qualityBuildPoints.allowance.negative} BP allowance`,
    )
  }

  if (gearBpSpent > GearBpAllowance) {
    warnings.push(`Gear exceeds the ${GearBpAllowance} BP allowance`)
  }

  if (totalSpent > totalBuildPoints) {
    warnings.push(
      `Total BP spent (${totalSpent}) exceeds the ${totalBuildPoints} BP budget`,
    )
  }

  const lineItems: BpLineItem[] = [
    {
      label: "Biology",
      spent: biologyBpSpent,
      isOver: false,
    },
    {
      label: "Qualities",
      spent: qualitiesNetBp,
      isOver: false,
    },
    {
      label: "Attributes",
      spent: attributesBpSpent,
      allowance: attrPointCosts.allowance,
      isOver: attributesBpSpent > attrPointCosts.allowance,
    },
    {
      label: "Skills",
      spent: skillsBpSpent,
      isOver: false,
    },
    {
      label: "Awakened",
      spent: awakenedBpSpent,
      isOver: false,
    },
    {
      label: "Gear",
      spent: gearBpSpent,
      allowance: GearBpAllowance,
      isOver: gearBpSpent > GearBpAllowance,
    },
    {
      label: "Contacts",
      spent: contactsBpSpent,
      isOver: false,
    },
  ]

  return {
    total: totalBuildPoints,
    spent: totalSpent,
    remaining,
    isOverBudget: totalSpent > totalBuildPoints,
    lineItems,
    warnings,
  }
}
