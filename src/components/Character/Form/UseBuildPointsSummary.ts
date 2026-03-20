import { useStore } from "@tanstack/react-store"

import { attrPointCosts } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { GearBpAllowance } from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import { qualityBuildPoints } from "#/components/Character/Form/Qualities/QualitiesFormGroup.tsx"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
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

export function useBuildPointsSummary(form: PlayerCharacterForm): BpSummary {
  const metatypeKey = useStore(form.store, (s) => s.values.metatype)
  const awakeningType = useStore(form.store, (s) => s.values.awakening)
  const qualities = useStore(form.store, (s) => s.values.qualities)
  const attributesBpSpent = useStore(
    form.store,
    (s) => s.values.buildPoints.spent.attributes,
  )
  const activeSkills = useStore(form.store, (s) => s.values.skills.activeSkills)
  const activeSkillGroups = useStore(
    form.store,
    (s) => s.values.skills.activeSkillGroups,
  )
  const knowledgeSkills = useStore(
    form.store,
    (s) => s.values.skills.knowledgeSkills,
  )
  const languageSkills = useStore(
    form.store,
    (s) => s.values.skills.languageSkills,
  )
  const logicValue = useStore(
    form.store,
    (s) => s.values.attributes.logic.value,
  )
  const intuitionValue = useStore(
    form.store,
    (s) => s.values.attributes.intuition.value,
  )
  const gearBpSpent = useStore(
    form.store,
    (s) => s.values.buildPoints.spent.gear,
  )

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

  const totalBuildPoints = useStore(
    form.store,
    (s) => s.values.buildPoints.total,
  )

  const totalSpent =
    biologyBpSpent +
    qualitiesNetBp +
    attributesBpSpent +
    skillsBpSpent +
    gearBpSpent

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
      label: "Gear",
      spent: gearBpSpent,
      allowance: GearBpAllowance,
      isOver: gearBpSpent > GearBpAllowance,
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
