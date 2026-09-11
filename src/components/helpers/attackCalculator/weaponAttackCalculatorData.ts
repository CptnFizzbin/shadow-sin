interface WeaponAttackModifierBase {
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

export type WeaponAttackModifier =
  | WeaponAttackToggleModifier
  | WeaponAttackStepperModifier

/**
 * Situational rows from the Melee Modifier Table (Shadowrun 4e, p. ~159) that adjust the
 * attacker's own dice pool. Rows that only affect the defender (e.g. "Defender receiving a
 * charge"), can't be automated (called shots, visibility), or are already applied elsewhere
 * (wound modifiers, via `WoundModLabel`) are left out, matching the Defense Calculator's
 * approach of only listing modifiers it can actually apply.
 */
export const meleeAttackModifiers: WeaponAttackModifier[] = [
  {
    label: "Friends in the melee",
    kind: "stepper",
    perUnit: 1,
    min: 0,
    max: 4,
  },
  {
    label: "Net Reach",
    kind: "stepper",
    perUnit: 1,
    min: -5,
    max: 5,
  },
  {
    label: "Using off-hand weapon",
    kind: "toggle",
    value: -2,
  },
  {
    label: "Superior position",
    kind: "toggle",
    value: 2,
  },
  {
    label: "Opponent prone",
    kind: "toggle",
    value: 3,
  },
  {
    label: "Making a charging attack",
    kind: "toggle",
    value: 2,
  },
  {
    label: "Opponent receiving a charge",
    kind: "toggle",
    value: +1,
  },
  {
    label: "Visiblity",
    kind: "stepper",
    perUnit: -1,
    min: 0,
    max: Infinity,
  },
  {
    label: "Called Shot",
    kind: "stepper",
    perUnit: -1,
    min: 0,
    max: Infinity,
  },
  {
    label: "Touch-only attack",
    kind: "toggle",
    value: 2,
  },
]

/**
 * Situational rows from the Ranged Combat Modifier Table (Shadowrun 4e) that adjust the
 * attacker's own dice pool. Recoil is left out — fire mode effects (recoil, burst fire DV bonus)
 * aren't implemented yet, per the Fire Mode step's own note. Range brackets, called shots, and
 * visibility modifiers are left out for the same reasons as the Melee Modifier Table above: this
 * app doesn't track the weapon/scene data they'd need, or they only affect the defender.
 */
export const rangedAttackModifiers: WeaponAttackModifier[] = [
  {
    label: "Firing while running",
    kind: "toggle",
    value: -2,
  },
  {
    label: "In melee combat",
    kind: "toggle",
    value: -3,
  },
  {
    label: "In a moving vehicle",
    kind: "toggle",
    value: -3,
  },
  {
    label: "Firing from cover",
    kind: "toggle",
    value: -2,
  },
  {
    label: "laser sight / smartlinked",
    kind: "stepper",
    perUnit: +1,
    min: 0,
    max: +2,
  },
  {
    label: "Using off-hand weapon",
    kind: "toggle",
    value: -2,
  },
  {
    label: "Aiming",
    kind: "stepper",
    perUnit: +1,
    min: 0,
    max: Infinity,
  },
  {
    label: "Blind fire",
    kind: "toggle",
    value: -6,
  },
  {
    label: "Called Shot",
    kind: "stepper",
    perUnit: -1,
    min: 0,
    max: Infinity,
  },
  {
    label: "Short burst tracer rounds",
    kind: "toggle",
    value: +1,
  },
  {
    label: "Long burst tracer rounds",
    kind: "toggle",
    value: +2,
  },
  {
    label: "Full auto tracer rounds",
    kind: "toggle",
    value: +3,
  },
  {
    label: "Recoil, burst",
    kind: "toggle",
    value: -2,
  },
  {
    label: "Recoil, long burst",
    kind: "toggle",
    value: -2,
  },
  {
    label: "Recoil, second shot",
    kind: "toggle",
    value: -1,
  },
  {
    label: "Recoil, full auto",
    kind: "toggle",
    value: -9,
  },
  {
    label: "Recoil, heavy weapon",
    kind: "stepper",
    perUnit: -2,
    min: 0,
    max: Infinity,
  },
  {
    label: "Recoil compensation",
    kind: "stepper",
    perUnit: +1,
    min: 0,
    max: Infinity,
  },
  {
    label: "Gyro stabilization",
    kind: "stepper",
    perUnit: +1,
    min: 0,
    max: Infinity,
  },
  {
    label: "Point-blank",
    kind: "toggle",
    value: +2,
  },
  {
    label: "Visiblity",
    kind: "stepper",
    perUnit: -1,
    min: 0,
    max: Infinity,
  },
]
