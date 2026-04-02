import type { ImplantData, ImplantType } from "#/lib/system/gear/implant-data.ts"
import { ImplantGrade } from "#/lib/system/gear/implant-data.ts"

export const BASE_ESSENCE = 6

export const ImplantGradeEssenceMultiplier: Record<ImplantGrade, number> = {
  [ImplantGrade.standard]: 1.0,
  [ImplantGrade.alpha]: 0.8,
  [ImplantGrade.beta]: 0.7,
  [ImplantGrade.delta]: 0.5,
}

export const ImplantGradeNuyenMultiplier: Record<ImplantGrade, number> = {
  [ImplantGrade.standard]: 1,
  [ImplantGrade.alpha]: 2,
  [ImplantGrade.beta]: 4,
  [ImplantGrade.delta]: 10,
}

export function getImplantEffectiveEssenceCost(item: ImplantData): number {
  const essenceCost = item.essenceCost ?? 0
  const multiplier =
    ImplantGradeEssenceMultiplier[item.grade as ImplantGrade]
    ?? ImplantGradeEssenceMultiplier[ImplantGrade.standard]
  return essenceCost * multiplier
}

export function getImplantEffectiveNuyenCost(item: ImplantData): number {
  const nuyenCost = item.cost ?? 0
  const multiplier =
    ImplantGradeNuyenMultiplier[item.grade as ImplantGrade]
    ?? ImplantGradeNuyenMultiplier[ImplantGrade.standard]
  return nuyenCost * multiplier
}

export interface ImplantEssenceSummary {
  cyberwareTotal: number
  biowareTotal: number
  higherType: ImplantType | null
  effectiveEssenceUsed: number
  remainingEssence: number
}
