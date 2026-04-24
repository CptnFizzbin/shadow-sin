import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { getImplantEffectiveEssenceCost } from "#/components/items/types/implants/implantUtils.ts"
import { useGearByType } from "#/components/items/useGearStore.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

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
    throw new Error("Use useEssenceAttr (or useEssenceInfo) for the Essence attribute")
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

  const skillMods = useGameEffects(GameEffectType.skillMod)
  const totalMod = skillMods
    .filter((e) => e.target === skill)
    .reduce((sum, e) => sum + e.value, 0)

  return rating + attribute + totalMod
}

export const useEssenceInfo = () => {
  const essenceInfo = useAttrInfo(AttributeKey.essence)
  const implants = useGearByType<ImplantData>(ItemType.implant)

  const implantEssence = implants
    .filter((implant) => !implant.parentId) // implant accessories cost Capacity, not Essence
    .map((implant) => ({
      implantType: implant.implantType,
      essenceCost: getImplantEffectiveEssenceCost(implant),
    }))

  const cyberwareEssence = implantEssence.filter((i) => i.implantType === ImplantType.cyberware)
    .map((item) => item.essenceCost)
    .reduce((sum, cost) => sum + cost, 0)

  const biowareEssence = implantEssence.filter((i) => i.implantType === ImplantType.bioware)
    .map((item) => item.essenceCost)
    .reduce((sum, cost) => sum + cost, 0)

  const essenceUsed =
    cyberwareEssence >= biowareEssence
      ? cyberwareEssence + (biowareEssence / 2)
      : biowareEssence + (cyberwareEssence / 2)

  const essenceRemaining = essenceInfo.max - essenceUsed

  return {
    essenceUsed,
    essenceRemaining,
    cyberwareEssence,
    biowareEssence,
  }
}
