import { getImplantEffectiveEssenceCost } from "#/components/items/types/implants/implantUtils.ts"
import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

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

  const implantEssence = implants
    .filter((implant) => !implant.items.parentId) // implant accessories cost Capacity, not Essence
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
