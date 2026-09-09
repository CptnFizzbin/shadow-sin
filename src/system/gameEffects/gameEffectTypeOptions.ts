import { AiAttributes, AttributeKey, AttributeLabels } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { GameEffectType } from "./gameEffectType.ts"

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
    // AI's Rating/System/Firewall/Response/Signal are always computed, never read through
    // GameEffects — an effect targeting one would silently never apply.
    targets: Object.values(AttributeKey)
      .filter((attr) => !AiAttributes.includes(attr))
      .map((attr) => ({
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
    label: "High Pain Tolerance",
    value: GameEffectType.highPainTolerance,
    targets: [
      { value: "all", label: "All" },
      ...Object.values(DamageTrackKey).map((track) => ({
        value: track,
        label: track,
      })),
    ],
  },
  {
    label: "Low Pain Tolerance",
    value: GameEffectType.lowPainTolerance,
    targets: [
      { value: "all", label: "All" },
      ...Object.values(DamageTrackKey).map((track) => ({
        value: track,
        label: track,
      })),
    ],
  },
]
