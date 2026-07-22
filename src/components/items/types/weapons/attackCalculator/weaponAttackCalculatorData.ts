export type WeaponAttackModifierKind = "toggle" | "stepper"

interface WeaponAttackModifierBase {
  id: string
  label: string
}

export interface WeaponAttackToggleModifier extends WeaponAttackModifierBase {
  kind: "toggle"
  value: number
}

export interface WeaponAttackStepperModifier extends WeaponAttackModifierBase {
  kind: "stepper"
  perUnit: number
  min: number
  max: number
}

export type WeaponAttackModifierDatum = WeaponAttackToggleModifier | WeaponAttackStepperModifier

/**
 * Situational rows from the Melee Modifier Table (Shadowrun 4e, p. ~159) that adjust the
 * attacker's own dice pool. Rows that only affect the defender (e.g. "Defender receiving a
 * charge"), can't be automated (called shots, visibility), or are already applied elsewhere
 * (wound modifiers, via `WoundModLabel`) are left out, matching the Defense Calculator's
 * approach of only listing modifiers it can actually apply.
 */
export const meleeAttackModifiers: WeaponAttackModifierDatum[] = [
  {
    id: "friendsInMelee",
    kind: "stepper",
    label: "Friends in the melee",
    perUnit: 1,
    min: 0,
    max: 4,
  },
  {
    id: "netReach",
    kind: "stepper",
    label: "Net Reach",
    perUnit: 1,
    min: -5,
    max: 5,
  },
  {
    id: "offHandWeapon",
    kind: "toggle",
    label: "Using off-hand weapon",
    value: -2,
  },
  {
    id: "superiorPosition",
    kind: "toggle",
    label: "Superior position",
    value: 2,
  },
  {
    id: "opponentProne",
    kind: "toggle",
    label: "Opponent prone",
    value: 3,
  },
  {
    id: "chargingAttack",
    kind: "toggle",
    label: "Making a charging attack",
    value: 2,
  },
  {
    id: "touchOnlyAttack",
    kind: "toggle",
    label: "Touch-only attack",
    value: 2,
  },
]
