export type AttackModifierKind = "toggle" | "stepper" | "note"

interface AttackModifierBase {
  key: string
  label: string
  hint?: string
  /** Renders a group heading above this entry (e.g. "Ranged Attacks Only"). */
  groupLabel?: string
}

export interface ToggleAttackModifier extends AttackModifierBase {
  kind: "toggle"
  /** Dice pool delta applied while the toggle is on. */
  value: number
}

export interface StepperAttackModifier extends AttackModifierBase {
  kind: "stepper"
  /** Dice pool delta applied per point. */
  value: number
  min: number
  max: number
}

export interface NoteAttackModifier extends AttackModifierBase {
  kind: "note"
}

export type AttackModifierDefinition = ToggleAttackModifier | StepperAttackModifier | NoteAttackModifier

/**
 * Melee Modifier Table (Shadowrun 4e, p. ~159) — situational modifiers to the
 * attacker's own dice pool for a melee attack. Entries that require tracking
 * outside this calculator (splitting the pool, called shots, visibility) are
 * kept as reference-only notes rather than interactive modifiers.
 */
export const meleeAttackModifiers: AttackModifierDefinition[] = [
  {
    key: "friendsInMelee",
    kind: "stepper",
    label: "Friends in the melee",
    hint: "+1 per friend (max +4)",
    value: 1,
    min: 0,
    max: 4,
  },
  {
    key: "characterWounded",
    kind: "note",
    label: "Character wounded",
    hint: "Applied automatically from your wound modifier.",
  },
  {
    key: "netReach",
    kind: "stepper",
    label: "Longer Reach",
    hint: "+1 per point of net Reach",
    value: 1,
    min: -5,
    max: 5,
  },
  {
    key: "offHandWeapon",
    kind: "toggle",
    label: "Using off-hand weapon",
    value: -2,
  },
  {
    key: "multipleTargets",
    kind: "note",
    label: "Attacking multiple targets",
    hint: "Splits your dice pool across targets — not automated here.",
  },
  {
    key: "superiorPosition",
    kind: "toggle",
    label: "Superior position",
    value: 2,
  },
  {
    key: "opponentProne",
    kind: "toggle",
    label: "Opponent prone",
    value: 3,
  },
  {
    key: "chargingAttack",
    kind: "toggle",
    label: "Making a charging attack",
    value: 2,
  },
  {
    key: "defenderReceivingCharge",
    kind: "note",
    label: "Defender receiving a charge",
    hint: "+1 to the defender's Defense Test, not your Attack Test.",
  },
  {
    key: "visibilityImpaired",
    kind: "note",
    label: "Visibility impaired",
    hint: "Consult the Visibility Table, p. 152.",
  },
  {
    key: "calledShot",
    kind: "note",
    label: "Called shot",
    hint: "Variable — see Called Shots, p. 161.",
  },
  {
    key: "touchOnlyAttack",
    kind: "toggle",
    label: "Touch-only attack",
    value: 2,
  },
]

/**
 * Defense Modifiers Table (Shadowrun 4e, p. ~160) — situational modifiers to
 * the defender's dice pool. Shown as a reference/aid: the calculator sums an
 * independent total so a GM or player can apply it to the defender's own
 * roll, since that pool isn't otherwise tracked by this app.
 */
export const defenseModifiers: AttackModifierDefinition[] = [
  {
    key: "defenderUnaware",
    kind: "note",
    label: "Defender unaware of attack",
    hint: "No defense possible.",
  },
  {
    key: "defenderWounded",
    kind: "note",
    label: "Defender wounded",
    hint: "-wound modifiers, applied to the defender's own roll.",
  },
  {
    key: "defenderInVehicle",
    kind: "toggle",
    label: "Defender inside a moving vehicle",
    value: 3,
  },
  {
    key: "priorDefenses",
    kind: "stepper",
    label: "Defended against previous attacks since last action",
    hint: "-1 per additional defense",
    value: -1,
    min: 0,
    max: 10,
  },
  {
    key: "defenderProne",
    kind: "toggle",
    label: "Defender prone",
    value: -2,
  },
  {
    key: "defenderRunning",
    kind: "toggle",
    label: "Defender running",
    groupLabel: "Ranged Attacks Only",
    value: 2,
  },
  {
    key: "defenderInMeleeTargetedByRanged",
    kind: "toggle",
    label: "Defender in melee, targeted by ranged attack",
    value: -3,
  },
  {
    key: "partialCover",
    kind: "toggle",
    label: "Defender/Target has Partial Cover",
    value: 2,
  },
  {
    key: "goodCover",
    kind: "toggle",
    label: "Defender/Target has Good Cover",
    value: 4,
  },
  {
    key: "attackerWideBurst",
    kind: "toggle",
    label: "Attacker firing wide burst",
    value: -2,
  },
  {
    key: "attackerLongWideBurst",
    kind: "toggle",
    label: "Attacker firing long wide burst",
    value: -5,
  },
  {
    key: "attackerFullAutoWideBurst",
    kind: "toggle",
    label: "Attacker firing full-auto wide burst",
    value: -9,
  },
  {
    key: "shotgunMediumSpread",
    kind: "toggle",
    label: "Attacker firing shotgun on medium spread",
    value: -2,
  },
  {
    key: "shotgunWideSpread",
    kind: "toggle",
    label: "Attacker firing shotgun on wide spread",
    value: -4,
  },
  {
    key: "areaAttackWeapon",
    kind: "toggle",
    label: "Attacker using area attack weapon (grenade, missile)",
    value: -2,
  },
]

/** Dice pool delta contributed by a single modifier at the given point value. */
export function modifierContribution(definition: AttackModifierDefinition, points: number): number {
  if (definition.kind === "note") return 0
  return points * definition.value
}

/** Total dice pool delta across all active modifiers in a list. */
export function sumModifiers(
  definitions: AttackModifierDefinition[],
  values: Record<string, number>,
): number {
  return definitions.reduce(
    (sum, definition) => sum + modifierContribution(definition, values[definition.key] ?? 0),
    0,
  )
}

/** Number of modifiers with a non-zero point value (toggles on, steppers > 0). */
export function countActiveModifiers(
  definitions: AttackModifierDefinition[],
  values: Record<string, number>,
): number {
  return definitions.filter(
    (definition) => definition.kind !== "note" && (values[definition.key] ?? 0) !== 0,
  ).length
}
