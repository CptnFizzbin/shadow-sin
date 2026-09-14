import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { AwakeningType } from "#/system/model/magic/awakeningType.ts"

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
