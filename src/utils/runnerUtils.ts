import { getEssenceUsage } from "#/components/entities/items/types/implants/implantUtils.ts"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { ImplantData } from "#/system/model/items/implantData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"

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
