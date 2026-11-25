import type { FC } from "react"

import { meleeAttackModifiers } from "./weaponAttackCalculatorData.ts"
import { WeaponAttackModifierList } from "./weaponAttackModifierList.tsx"

/** Modifiers step for melee weapons: the wound modifier plus the Melee Modifier Table. */
export const AttackWorkflowStepMeleeModifiers: FC = () => (
  <WeaponAttackModifierList modifiers={meleeAttackModifiers} />
)
