import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { selectAwakeningData, selectMetatypeData } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import {
  selectActiveSkills,
  selectKnowledgeSkills,
  selectLanguageSkills,
  selectSkillGroups,
} from "#/stores/runner/skills/skillsSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

import { useAdeptPowersBuildPoints } from "./useAdeptPowersBuildPoints.ts"
import { useAttributesBuildPoints } from "./useAttributesBuildPoints.ts"
import { useComplexFormsBuildPoints } from "./useComplexFormsBuildPoints.ts"
import { useContactsBuildPoints } from "./useContactsBuildPoints.ts"
import { useGearBuildPoints } from "./useGearBuildPoints.ts"
import { useQualitiesBuildPoints } from "./useQualitiesBuildPoints.ts"
import { useSpellsBuildPoints } from "./useSpellsBuildPoints.ts"
import { useSpritesBuildPoints } from "./useSpritesBuildPoints.ts"

export const RunnerBuilderMaxBp = 400

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
    total: RunnerBuilderMaxBp,
    spent: totalSpent,
    remaining: RunnerBuilderMaxBp - totalSpent,
    isOverBudget: totalSpent > RunnerBuilderMaxBp,
    lineItems: enabledLineItems,
  }
}

const useBuilderBiologyBuildPoints = (): BpLineItem => {
  const metatypeCost = useRunnerStoreSelector(selectMetatypeData).cost
  const awakeningCost = useRunnerStoreSelector(selectAwakeningData).cost

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
  const activeSkills = useRunnerStoreSelector(selectActiveSkills)
  const activeSkillGroups = useRunnerStoreSelector(selectSkillGroups)

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
  const logicAttr = useAttrValue(AttributeKey.logic)
  const intuitionAttr = useAttrValue(AttributeKey.intuition)

  const knowledgeSkills = useRunnerStoreSelector(selectKnowledgeSkills)
  const languageSkills = useRunnerStoreSelector(selectLanguageSkills)

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
