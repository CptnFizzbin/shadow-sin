import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

const allWeaponSkills = Object.entries(skillList)
  .filter(([, info]) => info.isWeaponSkill)
  .map(([key]) => key as SkillKey)

const skillsByWeaponType: Record<WeaponType, SkillKey[]> = {
  [WeaponType.melee]: [SkillKey.blades, SkillKey.clubs, SkillKey.unarmedCombat, SkillKey.exoticMeleeWeapons],
  [WeaponType.thrown]: [SkillKey.thrownWeapons, SkillKey.exoticRangedWeapons],
  [WeaponType.projectile]: [SkillKey.archery, SkillKey.thrownWeapons, SkillKey.exoticRangedWeapons],
  [WeaponType.firearm]: [
    SkillKey.pistols,
    SkillKey.automatics,
    SkillKey.longarms,
    SkillKey.heavyWeapons,
    SkillKey.gunnery,
    SkillKey.exoticRangedWeapons,
  ],
  [WeaponType.exotic]: [SkillKey.exoticMeleeWeapons, SkillKey.exoticRangedWeapons],
  [WeaponType.other]: allWeaponSkills,
}

/**
 * Combat skills relevant to a weapon's type, always including the weapon's
 * own configured skill (and, if given, the currently selected skill) even
 * when it falls outside the usual set for that weapon type.
 */
export function getSkillCandidates(weapon: WeaponData, selectedSkill?: SkillKey): SkillKey[] {
  const base = skillsByWeaponType[weapon.weaponType] ?? allWeaponSkills
  const candidates = new Set<SkillKey>([weapon.skill, ...base])
  if (selectedSkill) candidates.add(selectedSkill)

  return Array.from(candidates)
}
