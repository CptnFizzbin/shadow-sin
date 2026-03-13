import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export enum GearEffectType {
  modifier = "modifier",
}

export type GearEffectTarget =
  | string
  | "initative"
  | `attr.${AttributeKey}`
  | `skill.${string}`
  | `spell.${string}`
  | `adeptPower.${string}`
  | `damage.${string}.overflow`
  | `damage.resistance`
  | `damage.soak`
  | `weapon.recoil`

export interface GearEffectData {
  type: GearEffectType | string
  target: GearEffectTarget
  modifier: number
}
