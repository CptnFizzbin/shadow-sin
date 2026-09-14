import type { BpLineItem } from "#/components/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/skills/builder/skillsBuilderUtils.ts"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

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
