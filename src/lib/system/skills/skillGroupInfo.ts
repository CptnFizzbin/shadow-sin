import type { AwakeningType } from "#/lib/system/awakeningType"
import type { MetatypeType } from "#/lib/system/metatypeData"

export interface SkillGroupInfo {
  name: string
  required?: {
    awakenings?: AwakeningType[]
    metatypes?: MetatypeType[]
  }
}
