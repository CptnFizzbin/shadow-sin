import { useAttributesBuildPoints } from "#/components/Character/Form/Attributes/AttributeHooks.ts"
import { CharacterBuilderMaxBp } from "#/components/Character/Form/CharacterBuilderUtils.ts"
import { useContactsBuildPoints } from "#/components/Character/Form/Contacts/ContactsHooks.ts"
import { GearBpAllowance } from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import { isAdept } from "#/components/Character/Form/Resources/Adept/AdeptPowersUtils.ts"
import { useSpellsBuildPoints } from "#/components/Character/Form/Resources/Magician/SpellsHooks.ts"
import { isMagician } from "#/components/Character/Form/Resources/Magician/SpellsUtils.ts"
import { useTechnomancerBuildPoints } from "#/components/Character/Form/Resources/Technomancer/TechnomancerSectionHooks.ts"
import { isTechnomancer } from "#/components/Character/Form/Resources/Technomancer/TechnomancerUtils.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import { useBuilderStore } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
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
  const metatypeKey = useBuilderStore((state) => state.metatype)
  const awakeningType = useBuilderStore((state) => state.awakening)

  const qualities = useBuilderStore((state) => state.qualities)

  const activeSkills = useBuilderStore((s) => s.skills.activeSkills)
  const activeSkillGroups = useBuilderStore((s) => s.skills.activeSkillGroups)
  const knowledgeSkills = useBuilderStore((s) => s.skills.knowledgeSkills)
  const languageSkills = useBuilderStore((state) => state.skills.languageSkills)
  const logicValue = useBuilderStore((s) => s.attributes.logic)
  const intuitionValue = useBuilderStore((s) => s.attributes.intuition)
  const gearBpSpent = useBuilderStore((state) => state.buildPoints.spent.gear)

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
