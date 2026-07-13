import { useGearByType } from "#/components/items/gearHooks.ts"
import { getImplantEffectiveEssenceCost } from "#/components/items/types/implants/implantUtils.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { useAllAttrInfos, useAttrInfo, useAttrValue } from "./attributes/attributesProvider.tsx"
import { useRunnerData } from "./sheet/runnerStoreProvider.tsx"

// Re-exported for convenience — see attributesProvider.tsx for full documentation.
export { useAllAttrInfos, useAttrInfo }

/**
 * Find the next available alias by appending an incrementing number.
 * E.g. "Artemis" → "Artemis 2" → "Artemis 3" … until no existing runner
 * uses that alias.
 */
export function resolveAlias(
  baseAlias: string,
  existingAliases: Set<string>,
): string {
  let counter = 2
  let candidate = `${baseAlias} ${counter}`
  while (existingAliases.has(candidate)) {
    counter++
    candidate = `${baseAlias} ${counter}`
  }
  return candidate
}

/**
 * Hook to retrieve the current value of an attribute.
 * Reads from the nearest `AttributesProvider` in the tree.
 *
 * @deprecated Prefer `useAttrValue` from `attributesProvider.tsx` directly.
 *   This wrapper exists for backwards compatibility and adds an Essence guard.
 * @throws if called with `AttributeKey.essence` — use `useEssenceInfo` instead.
 */
export const useAttr = (attribute: AttributeKey) => {
  if (attribute === AttributeKey.essence) {
    throw new Error("Use useEssenceInfo for the Essence attribute")
  }

  return useAttrValue(attribute)
}

/**
 * Hook to retrieve the effective rating of an active skill, accounting for skill groups.
 */
export const useActiveSkillRating = (skill: SkillKey) => {
  const skillInfo = skillList[skill]

  const skillRating = useRunnerData((sheet) => {
    return sheet.skills.activeSkills.find((s) => s.name === skill)?.rating || 0
  })

  const groupRating = useRunnerData((sheet) => {
    if (!skillInfo) return 0
    return sheet.skills.skillGroups.find((s) => s.name === skillInfo.group)?.rating || 0
  })

  return Math.max(skillRating, groupRating, 0)
}

/**
 * Hook to retrieve the total value for an active skill check (rating + attribute + mods).
 */
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

/**
 * Hook to retrieve essence usage and remaining values.
 */
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
