import { AttributeKey, AttributeLabels } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

interface GameEffectOption {
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
    label: "Skill Specialization Modifier",
    value: GameEffectType.skillSpecializationMod,
    targets: Object.values(SkillKey).map((skill) => ({
      value: skill,
      label: skill,
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
    label: "Extra Initiative Dice",
    value: GameEffectType.extraInitiativeDice,
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
