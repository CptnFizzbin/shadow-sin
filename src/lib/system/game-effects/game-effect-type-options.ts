import { AttributeKey, AttributeLabels } from "#/lib/system/attribute-key.ts"
import { DamageTrackKey } from "#/lib/system/damage-track-key.ts"
import { dicePools } from "#/lib/system/dice-pools/dice-pool-data.ts"
import { GameEffectType } from "#/lib/system/game-effects/game-effect-type.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

export interface GameEffectOption {
  label: string
  value: GameEffectType
  targets?: Array<{
    label: string
    value: string
  }>
}

export const GameEffectTypeOptions: GameEffectOption[] = [
  {
    label: "Attribute Modifier",
    value: GameEffectType.attrMod,
    targets: Object.values(AttributeKey).map((attr) => ({
      value: attr,
      label: AttributeLabels[attr],
    })),
  },
  {
    label: "Skill Modifier",
    value: GameEffectType.skillMod,
    targets: Object.values(SkillKey).map((skill) => ({
      value: skill,
      label: skill,
    })),
  },
  {
    label: "Dice Pool Modifier",
    value: GameEffectType.dicePoolMod,
    targets: Object.entries(dicePools).map(([key, dicePool]) => ({
      value: key,
      label: dicePool.label,
    })),
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
    targets: [
      { value: "all", label: "All" },
      ...Object.values(DamageTrackKey).map((track) => ({
        value: track,
        label: track,
      })),
    ],
  },
]
