import type { RemixiconComponentType } from "@remixicon/react"
import { RiFireLine, RiSparklingLine, RiSwordLine } from "@remixicon/react"

import { SkillKey } from "#/system/skills/skillKey.ts"

export type DefenseAttackType = "melee" | "ranged" | "spell"

export interface DefenseAttackTypeInfo {
  type: DefenseAttackType
  label: string
  description: string
  color: "success" | "info" | "warning" | "error"
  Icon: RemixiconComponentType
}

/** Landing rows of the Defense Calculator hub: one per kind of incoming attack. */
export const defenseAttackTypes: DefenseAttackTypeInfo[] = [
  {
    type: "melee",
    label: "Melee",
    description: "Block, dodge, or parry an incoming melee or unarmed attack.",
    color: "error",
    Icon: RiSwordLine,
  },
  {
    type: "ranged",
    label: "Ranged",
    description: "Dodge an incoming firearm, thrown weapon, or other ranged attack.",
    color: "info",
    Icon: RiFireLine,
  },
  {
    type: "spell",
    label: "Spell",
    description: "Resist an incoming combat spell with Counterspelling.",
    color: "warning",
    Icon: RiSparklingLine,
  },
]

export interface DefenseSkillOption {
  /** Unique within its attack type's list. */
  key: string
  label: string
  /** Omitted for the baseline "no skill" option (attribute alone). */
  skill?: SkillKey
}

/** Selectable defense skills per attack type. The first entry is always the no-skill baseline. */
export const defenseSkillOptionsByAttackType: Record<DefenseAttackType, DefenseSkillOption[]> = {
  melee: [
    { key: "none", label: "None (Reaction only)" },
    { key: "dodge", label: "Dodge", skill: SkillKey.dodge },
    { key: "unarmedCombat", label: "Block/Parry (Unarmed Combat)", skill: SkillKey.unarmedCombat },
    { key: "blades", label: "Parry (Blades)", skill: SkillKey.blades },
    { key: "clubs", label: "Parry (Clubs)", skill: SkillKey.clubs },
  ],
  ranged: [
    { key: "none", label: "None (Reaction only)" },
    { key: "dodge", label: "Full Dodge", skill: SkillKey.dodge },
  ],
  spell: [
    { key: "none", label: "None (attribute only)" },
    { key: "counterspelling", label: "Counterspelling", skill: SkillKey.counterspelling },
  ],
}

export type DefenseModifierKind = "toggle" | "stepper" | "choice"

interface DefenseModifierBase {
  id: string
  label: string
  /** Omitted means the modifier applies to every attack type. */
  attackTypes?: DefenseAttackType[]
}

export interface DefenseToggleModifier extends DefenseModifierBase {
  kind: "toggle"
  value: number
}

export interface DefenseStepperModifier extends DefenseModifierBase {
  kind: "stepper"
  perUnit: number
  unitLabel: string
  min: number
  max: number
}

export interface DefenseChoiceOption {
  key: string
  label: string
  value: number
}

export interface DefenseChoiceModifier extends DefenseModifierBase {
  kind: "choice"
  /** First option should be the neutral/"none" baseline. */
  options: DefenseChoiceOption[]
}

export type DefenseModifierDatum = DefenseToggleModifier | DefenseStepperModifier | DefenseChoiceModifier

/** Situational rows from the Defense Modifiers Table. */
export const defenseModifiers: DefenseModifierDatum[] = [
  {
    id: "vehicle",
    kind: "toggle",
    label: "You're inside a moving vehicle",
    value: 3,
  },
  {
    id: "prone",
    kind: "toggle",
    label: "You're prone",
    value: -2,
  },
  {
    id: "previousDefenses",
    kind: "stepper",
    label: "You've defended against previous attacks since your last action",
    perUnit: -1,
    unitLabel: "additional defense",
    min: 0,
    max: 10,
  },
  {
    id: "running",
    kind: "toggle",
    label: "You're running",
    value: 2,
    attackTypes: ["ranged"],
  },
  {
    id: "meleeTargetedByRanged",
    kind: "toggle",
    label: "You're in melee, targeted by a ranged attack",
    value: -3,
    attackTypes: ["ranged"],
  },
  {
    id: "cover",
    kind: "choice",
    label: "Cover",
    attackTypes: ["ranged"],
    options: [
      { key: "none", label: "None", value: 0 },
      { key: "partial", label: "Partial Cover", value: 2 },
      { key: "good", label: "Good Cover", value: 4 },
    ],
  },
  {
    id: "attackMethod",
    kind: "choice",
    label: "Attacker's firing method",
    attackTypes: ["ranged"],
    options: [
      { key: "none", label: "None", value: 0 },
      { key: "wideBurst", label: "Wide Burst", value: -2 },
      { key: "longWideBurst", label: "Long Wide Burst", value: -5 },
      { key: "fullAutoWideBurst", label: "Full-Auto Wide Burst", value: -9 },
      { key: "shotgunMedium", label: "Shotgun, Medium Spread", value: -2 },
      { key: "shotgunWide", label: "Shotgun, Wide Spread", value: -4 },
      { key: "areaAttack", label: "Area Attack Weapon (grenade, missile)", value: -2 },
    ],
  },
]

export const defenseModifiersForAttackType = (attackType: DefenseAttackType): DefenseModifierDatum[] =>
  defenseModifiers.filter((modifier) => !modifier.attackTypes || modifier.attackTypes.includes(attackType))
