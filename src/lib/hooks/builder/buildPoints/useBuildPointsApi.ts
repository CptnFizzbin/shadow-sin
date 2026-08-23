import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/lib/stores/runner/skills/skillsSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

import { useAdeptPowersBuildPoints } from "./useAdeptPowersBuildPoints.ts"
import { useAttributesBuildPoints } from "./useAttributesBuildPoints.ts"
import { useComplexFormsBuildPoints } from "./useComplexFormsBuildPoints.ts"
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
    total: BuilderConfig.buildPoints.total,
    spent: totalSpent,
    remaining: BuilderConfig.buildPoints.total - totalSpent,
    isOverBudget: totalSpent > BuilderConfig.buildPoints.total,
    lineItems: enabledLineItems,
  }
}

const useBuilderBiologyBuildPoints = (): BpLineItem => {
  const metatypeCost = useRunnerSelector(BiologySelectors.selectMetatypeInfo).cost
  const awakeningCost = useRunnerSelector(BiologySelectors.selectAwakeningInfo).cost

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
  const activeSkills = useRunnerSelector(SkillsSelectors.selectActiveSkills)
  const activeSkillGroups = useRunnerSelector(SkillsSelectors.selectSkillGroups)

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
  const logicAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.logic })
  const intuitionAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.intuition })

  const knowledgeSkills = useRunnerSelector(SkillsSelectors.selectKnowledgeSkills)
  const languageSkills = useRunnerSelector(SkillsSelectors.selectLanguageSkills)

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
