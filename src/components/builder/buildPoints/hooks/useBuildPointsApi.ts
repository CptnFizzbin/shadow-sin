import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { CharacterBuilderMaxBp } from "#/components/builder/characterBuilderUtils.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useAttr } from "#/components/character/characterUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

import { useAdeptPowersBuildPoints } from "./useAdeptPowersBuildPoints.ts"
import { useAttributesBuildPoints } from "./useAttributesBuildPoints.ts"
import {
  useComplexFormsBuildPoints,
} from "./useComplexFormsBuildPoints.ts"
import { useContactsBuildPoints } from "./useContactsBuildPoints.ts"
import { useGearBuildPoints } from "./useGearBuildPoints.ts"
import { useQualitiesBuildPoints } from "./useQualitiesBuildPoints.ts"
import { useSpellsBuildPoints } from "./useSpellsBuildPoints.ts"
import { useSpritesBuildPoints } from "./useSpritesBuildPoints.ts"

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

const useBuilderBiologyBuildPoints = (): BpLineItem => {
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

const useActiveSkillsBuildPoints = () => {
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

const useKnowledgeSkillsBuildPoints = () => {
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
