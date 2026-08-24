import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

import { selectAdeptPowersBuildPoints } from "./useAdeptPowersBuildPoints.ts"
import { useAttributesBuildPoints } from "./useAttributesBuildPoints.ts"
import { selectComplexFormsBuildPoints } from "./useComplexFormsBuildPoints.ts"
import { selectContactsBuildPoints } from "./useContactsBuildPoints.ts"
import { selectGearBuildPoints } from "./useGearBuildPoints.ts"
import { selectQualitiesBuildPoints } from "./useQualitiesBuildPoints.ts"
import { useSpellsBuildPoints } from "./useSpellsBuildPoints.ts"
import { selectSpritesBuildPoints } from "./useSpritesBuildPoints.ts"

export const useBuilderBuildPointsApi = () => {
  const lineItems: BpLineItem[] = [
    { sectionId: BuilderSectionId.profile, spent: 0 },
    useBuilderBiologyBuildPoints(),
    useAttributesBuildPoints(),
    useRunnerSelector(selectQualitiesBuildPoints),
    useActiveSkillsBuildPoints(),
    useKnowledgeSkillsBuildPoints(),
    useSpellsBuildPoints(),
    useRunnerSelector(selectAdeptPowersBuildPoints),
    useRunnerSelector(selectComplexFormsBuildPoints),
    useRunnerSelector(selectSpritesBuildPoints),
    useRunnerSelector(selectGearBuildPoints),
    useRunnerSelector(selectContactsBuildPoints),
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
