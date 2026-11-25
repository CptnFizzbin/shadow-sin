import type { FC } from "react"

import { rangedAttackModifiers } from "./weaponAttackCalculatorData.ts"
import { WeaponAttackModifierList } from "./weaponAttackModifierList.tsx"

/** Modifiers step for ranged weapons: the wound modifier plus the Ranged Combat Modifier Table. */
export const AttackWorkflowStepRangedModifiers: FC = () => (
  <WeaponAttackModifierList modifiers={rangedAttackModifiers} />
)
