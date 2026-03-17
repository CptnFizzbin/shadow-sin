import type { AttributeKey } from "#/lib/system/types/attributeKey.ts";

export enum GearEffectType {
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
  | `weapon.recoil`;

export interface GearEffectData {
  type: GearEffectType | string;
  target?: GearEffectTarget;
  value: number;
}
