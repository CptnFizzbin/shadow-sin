import type { ImplantData } from "#/data/items/implantData.ts"
import { ImplantGrade, ImplantType } from "#/data/items/implantData.ts"

export const BASE_ESSENCE = 6

const ImplantGradeEssenceMultiplier: Record<ImplantGrade, number> = {
  [ImplantGrade.standard]: 1.0,
  [ImplantGrade.alpha]: 0.8,
  [ImplantGrade.beta]: 0.7,
  [ImplantGrade.delta]: 0.5,
}

const ImplantGradeNuyenMultiplier: Record<ImplantGrade, number> = {
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

/** Essence lost to a set of implants, split by implant type. */
export interface EssenceUsage {
  cyberware: number
  bioware: number
  /** Combined Essence loss: the larger of the two types in full, plus half of the smaller one. */
  total: number
}

/**
 * Returns the Essence lost to `implants`. Every implant counts, including implant accessories,
 * using its grade-adjusted Essence cost.
 */
export function getEssenceUsage(implants: ImplantData[]): EssenceUsage {
  const sumEssenceOf = (implantType: ImplantType) => implants
    .filter((implant) => implant.implantType === implantType)
    .reduce((sum, implant) => sum + getImplantEffectiveEssenceCost(implant), 0)

  const cyberware = sumEssenceOf(ImplantType.cyberware)
  const bioware = sumEssenceOf(ImplantType.bioware)

  return {
    cyberware,
    bioware,
    total: Math.max(cyberware, bioware) + (Math.min(cyberware, bioware) / 2),
  }
}

/**
 * Returns the whole points of Essence spent on `implants`: their combined Essence loss (see
 * {@link getEssenceUsage}) rounded up. This is what reduces the Runner's Essence and Magic.
 */
export function getEssenceSpent(implants: ImplantData[]): number {
  // Round off floating-point noise first, so e.g. 0.1 + 0.2 + 0.7 ceils to 1, not 2.
  return Math.ceil(Number(getEssenceUsage(implants).total.toFixed(4)))
}
