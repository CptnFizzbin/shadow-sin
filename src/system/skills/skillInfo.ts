import type { AttributeKey } from "#/system/attributeKey"
import type { AwakeningType } from "#/system/awakeningType"

import type { SkillCategory } from "./skillCategory"
import type { SkillGroupKey } from "./skillGroupKey"

export interface SkillInfo {
  attr: AttributeKey
  category: SkillCategory
  group?: SkillGroupKey
  isWeaponSkill?: boolean
  defaultable?: boolean
  awakening?: AwakeningType[]

  /**
   * A list of available specializations for the skill.
   * Not the runner's selected specialization
   */
  specializations?: (string | { custom: true, placeholder: string })[]
}
