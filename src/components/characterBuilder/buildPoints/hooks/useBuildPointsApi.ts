import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import type { BpLineItem } from "#/components/characterBuilder/buildPoints/bpLineItem.ts"
import { useAdeptPowersBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useAdeptPowersBuildPoints.ts"
import { useAttributesBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useAttributesBuildPoints.ts"
import {
  useComplexFormsBuildPoints,
} from "#/components/characterBuilder/buildPoints/hooks/useComplexFormsBuildPoints.ts"
import { useContactsBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useContactsBuildPoints.ts"
import { useGearBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useGearBuildPoints.ts"
import { useQualitiesBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useQualitiesBuildPoints.ts"
import { useSpellsBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useSpellsBuildPoints.ts"
import { useSpritesBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useSpritesBuildPoints.ts"
import { CharacterBuilderMaxBp } from "#/components/characterBuilder/characterBuilderUtils.ts"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/characterBuilder/sections/skills/skillsBuilderUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

export const useBuilderBuildPointsApi = () => {
  const lineItems: BpLineItem[] = [
    { sectionId: BuilderSectionId.profile, spent: 0 },
    useBuilderBiologyBuildPoints(),
    useAttributesBuildPoints(),
    useQualitiesBuildPoints(),
    useActiveSkillsBuildPoints(),
    useKnowledgeSkillsBuildPoints(),
    useSpellsBuildPoints(),
    useAdeptPowersBuildPoints(),
    useComplexFormsBuildPoints(),
    useSpritesBuildPoints(),
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
    sectionId: BuilderSectionId.biology,
    spent: metatypeCost + awakeningCost,
  }
}

export const useBuilderSkillsBuildPoints = () => {
  const activeSkillsBp = useActiveSkillsBuildPoints().spent
  const knowledgeSkillBp = useKnowledgeSkillsBuildPoints().spent

  return {
    label: "Skills",
    spent: activeSkillsBp + knowledgeSkillBp,
    activeSkills: {
      bpSpent: activeSkillsBp,
    },
    knowledgeSkills: {
      bpSpent: knowledgeSkillBp,
    },
  }
}

export const useActiveSkillsBuildPoints = () => {
  const activeSkills = useCharacterSheet((sheet) => sheet.skills.activeSkills)
  const activeSkillGroups = useCharacterSheet((sheet) => sheet.skills.skillGroups)

  const activeSkillsBp = calculateActiveSkillsBp(
    activeSkills,
    activeSkillGroups,
  )

  return {
    sectionId: BuilderSectionId.activeSkills,
    label: "Active Skills",
    spent: activeSkillsBp,
  }
}

export const useKnowledgeSkillsBuildPoints = () => {
  const logicAttr = useAttr(AttributeKey.logic)
  const intuitionAttr = useAttr(AttributeKey.intuition)

  const knowledgeSkills = useCharacterSheet((sheet) => sheet.skills.knowledgeSkills)
  const languageSkills = useCharacterSheet((sheet) => sheet.skills.languageSkills)

  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    knowledgeSkills,
    languageSkills,
  )

  const freeSkillPoints = getFreeSkillPoints(logicAttr, intuitionAttr)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)

  return {
    sectionId: BuilderSectionId.knowledgeSkills,
    label: "Knowledge Skills",
    spent: extraSpBp,
  }
}
