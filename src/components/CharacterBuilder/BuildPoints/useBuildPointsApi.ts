import { useAttributesBuildPoints } from "#/components/CharacterBuilder/Attributes/AttributeHooks.ts"
import { useAttrApi } from "#/components/CharacterBuilder/Attributes/UseAttrApi.ts"
import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { useContactsBuildPoints } from "#/components/CharacterBuilder/Contacts/ContactsHooks.ts"
import { useGearBuildPoints } from "#/components/CharacterBuilder/Gear/GearUtils.ts"
import { useAdeptPowersBuildPoints } from "#/components/CharacterBuilder/Resources/Adept/AdeptPowersHooks.ts"
import { useSpellsBuildPoints } from "#/components/CharacterBuilder/Resources/Magician/SpellsHooks.ts"
import {
  useTechnomancerBuildPoints,
} from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerSectionHooks.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
} from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/SummaryLineItem.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"

export const useBuildPointsApi = () => {
  const lineItems: BpLineItem[] = [
    { label: "Profile", spent: 0 },
    useBiologyBuildPoints(),
    useAttributesBuildPoints(),
    useQualitiesBuildPoints(),
    useSkillsBuildPoints(),
    useSpellsBuildPoints(),
    useAdeptPowersBuildPoints(),
    useTechnomancerBuildPoints(),
    useGearBuildPoints(),
    useContactsBuildPoints(),
  ]

  const used = lineItems.reduce((acc, item) => acc + item.spent, 0)

  return {
    used: used,
    remaining: 400 - used,
    lineItems: lineItems,
  }
}

export const useBiologyBuildPoints = (): BpLineItem => {
  const metatypeKey = useCharacterBuilderStore((state) => state.metatype)
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)

  const metatypeCost = metatypes[metatypeKey].cost
  const awakeningCost = awakenings[awakeningType].cost

  return {
    label: "Biology",
    spent: metatypeCost + awakeningCost,
  }
}

export const useQualitiesBuildPoints = () => {
  const qualities = useCharacterBuilderStore((sheet) => sheet.qualities)

  const positiveQualities = qualities
    .filter((q) => q.type === "positive")

  const positiveBP = positiveQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  const negativeQualities = qualities
    .filter((q) => q.type === "negative")

  const negativeBP = negativeQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  return {
    label: "Qualities",
    spent: positiveBP - negativeBP,
    qualities: {
      positive: positiveQualities,
      negative: negativeQualities,
    },
  }
}

export const useSkillsBuildPoints = (): BpLineItem => {
  const store = useCharacterBuilderStoreContext()
  const logicAttr = useAttrApi(AttributeKey.logic, store)
  const intuitionAttr = useAttrApi(AttributeKey.intuition, store)

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

  const activeSkillsBp = calculateActiveSkillsBp(
    activeSkills,
    activeSkillGroups,
  )

  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    knowledgeSkills,
    languageSkills,
  )

  const freeSkillPoints = getFreeSkillPoints(logicAttr.value, intuitionAttr.value)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)

  return {
    label: "Skills",
    spent: activeSkillsBp + extraSpBp,
  }
}
