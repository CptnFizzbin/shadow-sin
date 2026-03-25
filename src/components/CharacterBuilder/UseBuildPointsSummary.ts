import { useAttributesBuildPoints } from "#/components/Character/Form/Attributes/AttributeHooks.ts"
import { useContactsBuildPoints } from "#/components/Character/Form/Contacts/ContactsHooks.ts"
import { useBuildStateStore } from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import { CharacterBuilderMaxBp } from "#/components/CharacterBuilder/CharacterBuilderUtils.ts"
import { GearBpAllowance } from "#/components/CharacterBuilder/Gear/GearSectionRequirements.ts"
import { isAdept } from "#/components/CharacterBuilder/Resources/Adept/AdeptPowersUtils.ts"
import { useSpellsBuildPoints } from "#/components/CharacterBuilder/Resources/Magician/SpellsHooks.ts"
import { isMagician } from "#/components/CharacterBuilder/Resources/Magician/SpellsUtils.ts"
import { useTechnomancerBuildPoints } from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerSectionHooks.ts"
import { isTechnomancer } from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerUtils.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"
import { metatypes } from "#/lib/system/types/MetatypeData.ts"
import { awakenings } from "#/lib/system/types/awakeningType.ts"

export interface BpLineItem {
  label: string
  spent: number
  allowance?: number
  enabled?: boolean
}

export interface BpSummary {
  total: number
  spent: number
  lineItems: BpLineItem[]
}

export function useBuildPointsSummary(): BpSummary {
  const metatypeKey = useBuildStateStore((state) => state.metatype)
  const awakeningType = useBuildStateStore((state) => state.awakening)

  const qualities = useBuildStateStore((state) => state.qualities)

  const activeSkills = useBuildStateStore((s) => s.skills.activeSkills)
  const activeSkillGroups = useBuildStateStore(
    (s) => s.skills.activeSkillGroups,
  )
  const knowledgeSkills = useBuildStateStore((s) => s.skills.knowledgeSkills)
  const languageSkills = useBuildStateStore(
    (state) => state.skills.languageSkills,
  )
  const logicValue = useBuildStateStore((s) => s.attributes.logic)
  const intuitionValue = useBuildStateStore((s) => s.attributes.intuition)
  const gearBpSpent = useBuildStateStore(
    (state) => state.buildPoints.spent.gear,
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

  const technomancerBp = useTechnomancerBuildPoints()

  const lineItems: BpLineItem[] = [
    {
      label: "Profile",
      spent: 0,
    },
    {
      label: "Biology",
      spent: biologyBpSpent,
    },
    {
      label: "Attributes",
      ...useAttributesBuildPoints(),
    },
    {
      label: "Qualities",
      spent: qualitiesNetBp,
    },
    {
      label: "Skills",
      spent: skillsBpSpent,
    },
    {
      label: "Spells",
      enabled: isMagician(awakeningType),
      ...useSpellsBuildPoints(),
    },
    {
      label: "Adept Powers",
      enabled: isAdept(awakeningType),
      spent: 0,
    },
    {
      label: "Technomancer",
      enabled: isTechnomancer(awakeningType),
      ...technomancerBp,
    },
    {
      label: "Technomancer",
      enabled: isTechnomancer(awakeningType),
      ...technomancerBp,
    },
    {
      label: "Cyberware",
      spent: gearBpSpent,
      allowance: GearBpAllowance,
    },
    {
      label: "Contacts",
      ...useContactsBuildPoints(),
    },
  ]

  const enabledLineItems = lineItems.filter(
    (item) => typeof item.enabled === "undefined" || item.enabled,
  )
  const totalSpent = enabledLineItems.reduce((sum, item) => sum + item.spent, 0)

  return {
    total: CharacterBuilderMaxBp,
    spent: totalSpent,
    lineItems: enabledLineItems,
  }
}
