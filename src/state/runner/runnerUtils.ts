import { AttributeKey } from "#data/attributes/attributeKey.ts"
import { GameEffectType } from "#data/gameEffects/gameEffectType.ts"
import type { ImplantData } from "#data/items/implantData.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { SkillKey } from "#data/skills/skillKey.ts"
import { skillList } from "#data/skills/skillList.ts"
import { getEssenceUsage } from "#rules/items/implantUtils.ts"
import { useEntitySelector } from "#state/entity/useEntitySelector.ts"

import { AttrSelectors } from "./attributes/attributes.selector.ts"
import { GameEffectSelectors } from "./gameEffects/useGameEffects.ts"
import { useGearByType } from "./items/gearHooks.ts"
import { useRunnerSelector } from "./runnerStore.selectors.ts"
import { SkillsSelectors } from "./skills/skills.selector.ts"

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
 * Hook to retrieve the total value for an active skill check (rating + attribute + mods).
 */
export const useActiveSkill = (skill: SkillKey) => {
  const skillInfo = skillList[skill]
  const rating = useRunnerSelector(SkillsSelectors.selectValue, { skillName: skill })
  const attribute = useEntitySelector(AttrSelectors.selectValue, { key: skillInfo.attr })

  const skillMods = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.skillMod })
  const totalMod = skillMods
    .filter((e) => e.target === skill)
    .reduce((sum, e) => sum + e.value, 0)

  return rating + attribute + totalMod
}

/**
 * Hook to retrieve essence usage and remaining values.
 */
export const useEssenceInfo = () => {
  const essenceInfo = useRunnerSelector(AttrSelectors.selectInfo, { key: AttributeKey.essence })
  const implants = useGearByType<ImplantData>(ItemType.implant)

  const essenceUsage = getEssenceUsage(implants)
  const essenceUsed = essenceUsage.total

  const essenceRemaining = essenceInfo.max - essenceUsed

  return {
    essenceUsed,
    essenceRemaining,
    cyberwareEssence: essenceUsage.cyberware,
    biowareEssence: essenceUsage.bioware,
  }
}
