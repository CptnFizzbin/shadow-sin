import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { getImplantEffectiveEssenceCost } from "#/components/Gear/ImplantUtils.ts"
import { useGearByType } from "#/components/Gear/UseGearApi.ts"
import type { AttributeInfo } from "#/lib/system/AttributeInfo.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import { Skills } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { ImplantType } from "#/lib/system/gear/implantData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const useAllAttrInfos = (): Record<AttributeKey, AttributeInfo> => {
  const metatype = useCharacterSheet((sheet) => metatypes[sheet.biology.metatype])
  const awakening = useCharacterSheet((sheet) => awakenings[sheet.biology.awakening])

  return {
    ...metatype.attributes,
    ...awakening.attributes,
  }
}

export const useAttrInfo = (attribute: AttributeKey): AttributeInfo => {
  const attributes = useAllAttrInfos()

  let attributeInfo = {
    ...attributes[attribute],
  }

  if (attribute === AttributeKey.magic || attribute === AttributeKey.resonance) {
    attributeInfo = {
      ...attributeInfo,
      ...attributes[attribute],
    }
  }

  return attributeInfo
}

export const useAttr = (attribute: AttributeKey) => {
  if (attribute === AttributeKey.essence) {
    throw new Error("Use useEssenseAttr (or useEssenseInfo) for the Essence attribute")
  }

  return useCharacterSheet((sheet) => {
    return sheet.attributes[attribute]
  })
}

export const useActiveSkill = (skill: SkillKey) => {
  const skillInfo = Skills[skill]

  const skillRating = useCharacterSheet((sheet) => {
    return sheet.skills.activeSkills.find((s) => s.name === skill)?.rating || 0
  })
  const groupRating = useCharacterSheet((sheet) => {
    return sheet.skills.skillGroups.find((s) => s.name === skillInfo.group)?.rating || 0
  })

  const attribute = useAttr(skillInfo.attr)
  return Math.max(skillRating, groupRating, 0) + attribute
}

export const useEssenseInfo = () => {
  const essenseInfo = useAttrInfo(AttributeKey.essence)
  const implants = useGearByType<ImplantData>(GearType.implant)

  const implantEssense = implants
    .filter((implant) => !implant.parentId) // implant accessories cost Capacity, not Essense
    .map((implant) => ({
      implantType: implant.implantType,
      essenceCost: getImplantEffectiveEssenceCost(implant),
    }))

  const cyberwareEssense = implantEssense.filter((i) => i.implantType === ImplantType.cyberware)
    .map((item) => item.essenceCost)
    .reduce((sum, cost) => sum + cost, 0)

  const biowareEssense = implantEssense.filter((i) => i.implantType === ImplantType.bioware)
    .map((item) => item.essenceCost)
    .reduce((sum, cost) => sum + cost, 0)

  const essenceUsed =
    cyberwareEssense >= biowareEssense
      ? cyberwareEssense + (biowareEssense / 2)
      : biowareEssense + (cyberwareEssense / 2)

  const essenseRemaining = essenseInfo.max - essenceUsed

  return {
    essenceUsed,
    essenseRemaining,
    cyberwareEssense,
    biowareEssense,
  }
}

export const useEssenseAttr = (): number => {
  const { essenseRemaining } = useEssenseInfo()
  return Math.floor(essenseRemaining)
}
