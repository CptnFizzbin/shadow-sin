import { CharacterData } from '../Character/CharacterData'
import { useCharacterData } from '../Character/CharacterProvider'
import { GearData } from '../Gear/GearData'
import { CharacterQuality } from '../Qualities/CharacterQuality'
import { ActiveSkillId } from '../Skills'
import { DamageType } from './Damage/DamageType'

export enum EffectType {
  attrBonus = 'attrBonus',
  attrMaxBonus = 'attrMaxBonus',
  attrOverride = 'attrOverride',
  defRatingAdj = 'defRatingAdj',
  dicePoolAdj = 'dicePoolAdj',
  dmgTrackAdj = 'dmgTrackAdj',
  initAdj = 'initAdj',
  skillAdj = 'skillAdj',
  skillMaxAdj = 'skillMaxAdj',
  woundPenaltyAdj = 'woundPenaltyAdj',
}

interface BaseEffect {
  type: EffectType
  wireless?: boolean
}

interface AttrAdj extends BaseEffect {
  type: EffectType.attrBonus
  attr: string
  value: number
}

export function isAttrAdj (effect: BaseEffect): effect is AttrAdj {
  return effect.type === EffectType.attrBonus
}

interface AttrMaxAdj extends BaseEffect {
  type: EffectType.attrMaxBonus
  attr: string
  value: number
}

export function isAttrMaxAdj (effect: BaseEffect): effect is AttrMaxAdj {
  return effect.type === EffectType.attrMaxBonus
}

interface DmgTrackAdj extends BaseEffect {
  type: EffectType.dmgTrackAdj
  track: DamageType
  value: number
}

export function isDmgTrackAdj (effect: BaseEffect): effect is DmgTrackAdj {
  return effect.type === EffectType.dmgTrackAdj
}

interface SkillMaxAdj extends BaseEffect {
  type: EffectType.skillMaxAdj
  skill: string
  value: number
}

export function isSkillMaxAdj (effect: BaseEffect): effect is SkillMaxAdj {
  return effect.type === EffectType.skillMaxAdj
}

interface AttrOverride extends BaseEffect {
  type: EffectType.attrOverride
  attr: string
  value: number
}

export function isAttrOverride (effect: BaseEffect): effect is AttrOverride {
  return effect.type === EffectType.attrOverride
}

interface InitAdj extends BaseEffect {
  type: EffectType.initAdj
  value: number
}

export function isInitAdj (effect: BaseEffect): effect is InitAdj {
  return effect.type === EffectType.initAdj
}

interface SkillAdj extends BaseEffect {
  type: EffectType.skillAdj
  skill: ActiveSkillId
  value: number
}

export function isSkillAdj (effect: BaseEffect): effect is SkillAdj {
  return effect.type === EffectType.skillAdj
}

interface DicePoolAdj extends BaseEffect {
  type: EffectType.dicePoolAdj
  name: string
  poolType: string
  value: number
}

export function isDicePoolAdj (effect: BaseEffect): effect is DicePoolAdj {
  return effect.type === EffectType.dicePoolAdj
}

interface DefRatingAdj extends BaseEffect {
  type: EffectType.defRatingAdj
  value: number
}

export function isDefRatingAdj (effect: BaseEffect): effect is DefRatingAdj {
  return effect.type === EffectType.defRatingAdj
}

interface WoundPenaltyAdj extends BaseEffect {
  type: EffectType.woundPenaltyAdj
  value: number | 'all' | 'double'
}

export function isWoundPenaltyAdj (effect: BaseEffect): effect is WoundPenaltyAdj {
  return effect.type === EffectType.woundPenaltyAdj
}

export type Effect =
  | AttrAdj
  | AttrMaxAdj
  | AttrOverride
  | DefRatingAdj
  | DicePoolAdj
  | DmgTrackAdj
  | InitAdj
  | SkillAdj
  | SkillMaxAdj
  | WoundPenaltyAdj

export const collectCharacterEffects = (character: CharacterData): Effect[] => {
  return [
    ...collectGearEffects(character.gear),
    ...collectQualityEffects(character.qualities),
  ]
}

export const collectGearEffects = (gear: GearData[]): Effect[] => {
  return gear.flatMap(gear => {
    if (gear.wirelessBonus?.enabled) {
      return gear.effects || []
    } else {
      return gear.effects?.filter(effect => !effect.wireless) || []
    }
  })
}

export const collectQualityEffects = (qualities: CharacterQuality[]): Effect[] => {
  return qualities.flatMap(quality => quality.effects || [])
}

export const useGameEffects = (): Effect[] => {
  const character = useCharacterData()
  if (!character) return []
  return collectCharacterEffects(character)
}
