import type { AttributeKey } from "#/lib/system/attributeKey"
import type { AwakeningType } from "#/lib/system/awakeningType"
import type { SkillCategory } from "#/lib/system/skills/skillCategory"
import type { SkillGroupKey } from "#/lib/system/skills/skillGroupKey"

export interface SkillInfo {
  attr: AttributeKey
  category: SkillCategory
  group?: SkillGroupKey
  isWeaponSkill?: boolean
  defaultable?: boolean
  awakening?: AwakeningType[]

  /**
   * A list of available specializations for the skill.
   * Not the character's selected specialization
   */
  specializations?: (string | { custom: true, placeholder: string })[]
}
