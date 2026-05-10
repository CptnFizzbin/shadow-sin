import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

/**
 * Hook to retrieve the effective rating of an active skill, accounting for skill groups.
 */
export const useActiveSkillRating = (skill: SkillKey): number => {
  const skillInfo = skillList[skill]

  const skillRating = useCharacterSheet((sheet) => {
    return sheet.skills.activeSkills.find((s) => s.name === skill)?.rating || 0
  })

  const groupRating = useCharacterSheet((sheet) => {
    return sheet.skills.skillGroups.find((s) => s.name === skillInfo.group)?.rating || 0
  })

  return Math.max(skillRating, groupRating, 0)
}

/**
 * Hook to retrieve the total value for an active skill check (rating + attribute + mods).
 */
export const useActiveSkill = (skill: SkillKey): number => {
  const skillInfo = skillList[skill]
  const rating = useActiveSkillRating(skill)
  const attribute = useAttr(skillInfo.attr)

  const skillMods = useGameEffects(GameEffectType.skillMod)
  const totalMod = skillMods
    .filter((e) => e.target === skill)
    .reduce((sum, e) => sum + e.value, 0)

  return rating + attribute + totalMod
}
