import { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import { AttributeKey, AttributeLabels, AttributeOrder } from "#/lib/system/attributeKey.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"

import { GameEffectType } from "./GameEffectType.ts"

export interface GameEffectTypeOption {
  label: string
  value: string
  targets?: Array<{ label: string; value: string }>
}

const attributeTargets = AttributeOrder.map((key) => ({
  label: AttributeLabels[key],
  value: key,
}))

const skillTargets = Object.values(SkillKey).map((key) => ({
  label: key,
  value: key,
}))

const damageTrackTargets = [
  { label: "All", value: "all" },
  { label: "Physical", value: DamageTrackKey.physical },
  { label: "Stun", value: DamageTrackKey.stun },
  { label: "Matrix", value: DamageTrackKey.matrix },
]

export const GameEffectTypeOptions: GameEffectTypeOption[] = [
  {
    label: "Attribute Modifier",
    value: GameEffectType.attrMod,
    targets: attributeTargets,
  },
  {
    label: "Skill Modifier",
    value: GameEffectType.skillMod,
    targets: skillTargets,
  },
  {
    label: "Dice Pool Modifier",
    value: GameEffectType.dicePoolMod,
    targets: skillTargets,
  },
  {
    label: "Initiative Bonus",
    value: GameEffectType.initiativeBonus,
  },
  {
    label: "Extra Initiative Passes",
    value: GameEffectType.extraInitiativePasses,
  },
  {
    label: "Recoil Reduction",
    value: GameEffectType.recoilReduction,
  },
  {
    label: "Pain Tolerance",
    value: GameEffectType.painTolerance,
    targets: damageTrackTargets,
  },
]