import type { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import type { DicePoolKey } from "#/lib/system/DicePools/dicePoolData.ts"
import type { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"

export interface GameEffectData {
  type: GameEffectType | string
  target?: string
  value: number
}

export interface DicePoolModEffect extends GameEffectData {
  type: GameEffectType.dicePoolMod
  target: DicePoolKey
}

export interface AttrModEffect extends GameEffectData {
  type: GameEffectType.attrMod
  target: AttributeKey
}

export interface SkillModEffect extends GameEffectData {
  type: GameEffectType.skillMod
  target: SkillKey
}

export interface ExtraInitiativePassesEffect extends GameEffectData {
  type: GameEffectType.extraInitiativePasses
}

export interface PainToleranceEffect extends GameEffectData {
  type: GameEffectType.painTolerance
  target: DamageTrackKey | "all"
}
