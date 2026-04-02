import type { AttributeKey } from "#/lib/system/attribute-key.ts"

export enum GameEffectType {
  setModifier = "setModifier",
  attrBonus = "attrBonus",
  skillBonus = "skillBonus",
  initiativeBonus = "initiativeBonus",
  recoilReduction = "recoilReduction",
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

export interface GameEffectData {
  type: GameEffectType | string
  target?: GearEffectTarget
  value: number
}
