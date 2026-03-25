import { useAttributesBuildPoints } from "#/components/CharacterBuilder/Attributes/AttributeHooks.ts"
import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { CharacterBuilderMaxBp } from "#/components/CharacterBuilder/CharacterBuilderUtils.ts"
import { useContactsBuildPoints } from "#/components/CharacterBuilder/Contacts/ContactsHooks.ts"
import { useGearBuildPoints } from "#/components/CharacterBuilder/Gear/GearUtils.ts"
import { isAdept } from "#/components/CharacterBuilder/Resources/Adept/AdeptPowersUtils.ts"
import { useSpellsBuildPoints } from "#/components/CharacterBuilder/Resources/Magician/SpellsHooks.ts"
import { isMagician } from "#/components/CharacterBuilder/Resources/Magician/SpellsUtils.ts"
import {
  useTechnomancerBuildPoints,
} from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerSectionHooks.ts"
import { isTechnomancer } from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerUtils.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/SummaryLineItem.ts"
import { metatypes } from "#/lib/system/types/MetatypeData.ts"
import { awakenings } from "#/lib/system/types/awakeningType.ts"

export interface BpSummary {
  total: number
  spent: number
  lineItems: BpLineItem[]
}

export function useBuildPointsSummary(): BpSummary {
  const metatypeKey = useCharacterBuilderStore((state) => state.metatype)
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)

  const qualities = useCharacterBuilderStore((state) => state.qualities)

  const activeSkills = useCharacterBuilderStore((s) => s.skills.activeSkills)
  const activeSkillGroups = useCharacterBuilderStore(
    (s) => s.skills.activeSkillGroups,
  )
  const knowledgeSkills = useCharacterBuilderStore(
    (s) => s.skills.knowledgeSkills,
  )
  const languageSkills = useCharacterBuilderStore(
    (state) => state.skills.languageSkills,
  )
  const logicValue = useCharacterBuilderStore((s) => s.attributes.logic.value)
  const intuitionValue = useCharacterBuilderStore(
    (s) => s.attributes.intuition.value,
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

  // Calculate skills BP dynamically from skills arrays
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
    useGearBuildPoints(),
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
