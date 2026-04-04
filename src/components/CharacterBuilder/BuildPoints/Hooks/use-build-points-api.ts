import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useAttr } from "#/components/Character/character-utils.ts"
import { useAdeptPowersBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-adept-powers-build-points.ts"
import { useAttributesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-attributes-build-points.ts"
import {
  useComplexFormsBuildPoints,
} from "#/components/CharacterBuilder/BuildPoints/Hooks/use-complex-forms-build-points.ts"
import { useContactsBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-contacts-build-points.ts"
import { useGearBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-gear-build-points.ts"
import { useQualitiesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-qualities-build-points.ts"
import { useSpellsBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-spells-build-points.ts"
import { useSpritesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-sprites-build-points.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/bp-line-item.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/CharacterBuilder/Sections/Skills/skills-builder-utils.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { CharacterBuilderMaxBp } from "#/components/CharacterBuilder/character-builder-utils.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { awakenings } from "#/lib/system/awakening-type.ts"
import { metatypes } from "#/lib/system/metatype-data.ts"

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
