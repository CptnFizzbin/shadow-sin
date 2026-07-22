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

/** Section a defense skill option is grouped under in the skill picker. */
export type DefenseSkillGroup = "Basic" | "Dodge" | "Parry" | "Block"

export const defenseSkillGroupOrder: DefenseSkillGroup[] = ["Basic", "Dodge", "Parry", "Block"]

export interface DefenseSkillOption {
  /** Unique within its attack type's list. */
  key: string
  label: string
  group: DefenseSkillGroup
  /** Omitted for the baseline "no skill" option (attribute alone). */
  skill?: SkillKey
  /** When true, the skill's dice are added a second time (e.g. Full Dodge doubles Dodge). */
  doubleSkill?: boolean
  /** Rules note shown under the option, e.g. an action-economy cost. */
  note?: string
}

/** Selectable defense skills per attack type, grouped by maneuver. */
export const defenseSkillOptionsByAttackType: Record<DefenseAttackType, DefenseSkillOption[]> = {
  melee: [
    { key: "none", label: "Basic", group: "Basic" },
    { key: "dodge", label: "Dodge", group: "Dodge", skill: SkillKey.dodge },
    {
      key: "full-dodge",
      label: "Full Dodge",
      group: "Dodge",
      skill: SkillKey.dodge,
      doubleSkill: true,
      note: "(consumes next action phase)",
    },
    { key: "block-unarmed", label: "Unarmed Combat", group: "Block", skill: SkillKey.unarmedCombat },
    { key: "parry-blades", label: "Blades", group: "Parry", skill: SkillKey.blades },
    { key: "parry-clubs", label: "Clubs", group: "Parry", skill: SkillKey.clubs },
    { key: "parry-unarmed", label: "Unarmed Combat", group: "Parry", skill: SkillKey.unarmedCombat },
  ],
  ranged: [
    { key: "none", label: "Basic", group: "Basic" },
    { key: "dodge", label: "Dodge", group: "Dodge", skill: SkillKey.dodge },
  ],
  // Spell defense uses a bespoke Counterspelling picker instead of this grouped list.
  spell: [
    { key: "none", label: "Basic", group: "Basic" },
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
    min: 1,
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
      { key: "none", label: "No Cover", value: 0 },
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
      { key: "none", label: "Normal Attack", value: 0 },
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
