import type { SkillKey } from "#/lib/system/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { DicePoolKey } from "#/lib/system/dicePoolData.ts"

export enum GameEffectType {
  setModifier = "setModifier",
  attrBonus = "attrBonus",
  skillBonus = "skillBonus",
  initiativeBonus = "initiativeBonus",
  recoilReduction = "recoilReduction",
  dicePoolMod = "dicePoolMod",
  attrMod = "attrMod",
  skillMod = "skillMod",
  extraInitiativePasses = "extraInitiativePasses",
  painTolerance = "painTolerance",
}

export type DmgTrackKey = "physical" | "stun"

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

export interface DicePoolModEffect extends GameEffectData {
  type: GameEffectType.dicePoolMod
  target: DicePoolKey
  value: number
}

export interface AttrModEffect extends GameEffectData {
  type: GameEffectType.attrMod
  target: AttributeKey
  value: number
}

export interface SkillModEffect extends GameEffectData {
  type: GameEffectType.skillMod
  target: SkillKey
  value: number
}

export interface ExtraInitiativePassesEffect extends GameEffectData {
  type: GameEffectType.extraInitiativePasses
  value: number
}

export interface PainToleranceEffect extends GameEffectData {
  type: GameEffectType.painTolerance
  target: DmgTrackKey
  value: number
}
