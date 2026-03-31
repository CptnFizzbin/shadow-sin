import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { useAttr } from "#/components/Character/CharacterUtils.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { useAdeptPowersBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseAdeptPowersBuildPoints.ts"
import { useAttributesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseAttributesBuildPoints.ts"
import { useContactsBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseContactsBuildPoints.ts"
import { useGearBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseGearBuildPoints.ts"
import { useSpellsBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseSpellsBuildPoints.ts"
import { CharacterBuilderMaxBp } from "#/components/CharacterBuilder/CharacterBuilderUtils.ts"
import {
  useTechnomancerBuildPoints,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerSectionHooks.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/Skills/SkillUtils.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"

export const useBuilderBuildPointsApi = () => {
  const lineItems: BpLineItem[] = [
    { label: "Profile", spent: 0 },
    useBuilderBiologyBuildPoints(),
    useAttributesBuildPoints(),
    useBuilderQualitiesBuildPoints(),
    useBuilderSkillsBuildPoints(),
    useSpellsBuildPoints(),
    useAdeptPowersBuildPoints(),
    useTechnomancerBuildPoints(),
    useGearBuildPoints(),
    useContactsBuildPoints(),
  ]

  const enabledLineItems = lineItems
    .filter((item) => typeof item.enabled === "undefined" || item.enabled)

  const totalSpent = enabledLineItems.reduce((acc, item) => acc + item.spent, 0)

  return {
    total: CharacterBuilderMaxBp,
    spent: totalSpent,
    remaining: CharacterBuilderMaxBp - totalSpent,
    isOverBudget: totalSpent > CharacterBuilderMaxBp,
    lineItems: enabledLineItems,
  }
}

export const useBuilderBiologyBuildPoints = (): BpLineItem => {
  const metatypeKey = useCharacterSheet((sheet) => sheet.biology.metatype)
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)

  const metatypeCost = metatypes[metatypeKey].cost
  const awakeningCost = awakenings[awakeningType].cost

  return {
    label: "Biology",
    spent: metatypeCost + awakeningCost,
  }
}

export const useBuilderQualitiesBuildPoints = () => {
  const qualities = useCharacterSheet((sheet) => sheet.qualities)

  const positiveQualities = qualities
    .filter((q) => q.type === "positive")

  const positiveBP = positiveQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  const negativeQualities = qualities
    .filter((q) => q.type === "negative")

  const negativeBP = negativeQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  return {
    label: "Qualities",
    spent: positiveBP - negativeBP,
    qualities: {
      positive: positiveQualities,
      negative: negativeQualities,
    },
  }
}

export const useBuilderSkillsBuildPoints = () => {
  const logicAttr = useAttr(AttributeKey.logic)
  const intuitionAttr = useAttr(AttributeKey.intuition)

  const activeSkills = useCharacterSheet((sheet) => sheet.skills.activeSkills)
  const activeSkillGroups = useCharacterSheet((sheet) => sheet.skills.skillGroups)
  const knowledgeSkills = useCharacterSheet((sheet) => sheet.skills.knowledgeSkills)
  const languageSkills = useCharacterSheet((sheet) => sheet.skills.languageSkills)

  const activeSkillsBp = calculateActiveSkillsBp(
    activeSkills,
    activeSkillGroups,
  )

  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    knowledgeSkills,
    languageSkills,
  )

  const freeSkillPoints = getFreeSkillPoints(logicAttr, intuitionAttr)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)

  return {
    label: "Skills",
    spent: activeSkillsBp + extraSpBp,
    activeSkills: {
      bpSpent: activeSkillsBp,
    },
    knowledgeSkills: {
      bpSpent: extraSpBp,
    },
  }
}
