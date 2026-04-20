import type { AttributeKey } from "#/system/attributeKey"
import type { AwakeningType } from "#/system/awakeningType"
import type { SkillCategory } from "#/system/skills/skillCategory"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey"

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
