export type WeaponAttackCalculatorStep = "weapon" | "skill" | "modifiers" | "result"

export interface WeaponAttackCalculatorStepInfo {
  step: WeaponAttackCalculatorStep
  label: string
}

export const weaponAttackCalculatorSteps: WeaponAttackCalculatorStepInfo[] = [
  { step: "weapon", label: "Weapon" },
  { step: "skill", label: "Skill" },
  { step: "modifiers", label: "Modifiers" },
  { step: "result", label: "Result" },
]
