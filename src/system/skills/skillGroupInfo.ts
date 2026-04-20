import type { AwakeningType } from "#/system/awakeningType"
import type { MetatypeType } from "#/system/metatypeData"

export interface SkillGroupInfo {
  name: string
  required?: {
    awakenings?: AwakeningType[]
    metatypes?: MetatypeType[]
  }
}
