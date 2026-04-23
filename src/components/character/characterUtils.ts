import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { getImplantEffectiveEssenceCost } from "#/components/implants/implantUtils.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { awakenings } from "#/system/awakeningType.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"
import { useGearByType } from "../gear/useGearStore.ts"

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

export const useActiveSkillRating = (skill: SkillKey) => {
  const skillInfo = skillList[skill]

  const skillRating = useCharacterSheet((sheet) => {
    return sheet.skills.activeSkills.find((s) => s.name === skill)?.rating || 0
  })

  const groupRating = useCharacterSheet((sheet) => {
    return sheet.skills.skillGroups.find((s) => s.name === skillInfo.group)?.rating || 0
  })

  return Math.max(skillRating, groupRating, 0)
}

export const useActiveSkill = (skill: SkillKey) => {
  const skillInfo = skillList[skill]
  const rating = useActiveSkillRating(skill)
  const attribute = useAttr(skillInfo.attr)
  return rating + attribute
}

export const useEssenseInfo = () => {
  const essenseInfo = useAttrInfo(AttributeKey.essence)
  const implants = useGearByType<ImplantData>(ItemType.implant)

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
