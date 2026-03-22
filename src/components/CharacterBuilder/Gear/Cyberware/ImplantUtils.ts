import {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"
import type { ImplantFormState } from "./Forms/ImplantFormState.ts"

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

export function getImplantEffectiveEssenceCost(item: ImplantFormState): number {
  const multiplier =
    ImplantGradeEssenceMultiplier[item.grade as ImplantGrade] ??
    ImplantGradeEssenceMultiplier[ImplantGrade.standard]
  return item.essenceCost * multiplier
}

export function getImplantEffectiveNuyenCost(item: ImplantFormState): number {
  const multiplier =
    ImplantGradeNuyenMultiplier[item.grade as ImplantGrade] ??
    ImplantGradeNuyenMultiplier[ImplantGrade.standard]
  return item.cost * multiplier
}

export interface ImplantEssenceSummary {
  cyberwareTotal: number
  biowareTotal: number
  higherType: ImplantType | null
  effectiveEssenceUsed: number
  remainingEssence: number
}

export function calculateImplantEssence(
  implants: ImplantFormState[],
): ImplantEssenceSummary {
  const cyberwareTotal = implants
    .filter(
      (implant) =>
        implant.implantType === ImplantType.cyberware ||
        implant.implantType === "cyberware",
    )
    .reduce((sum, implant) => sum + getImplantEffectiveEssenceCost(implant), 0)

  const biowareTotal = implants
    .filter(
      (implant) =>
        implant.implantType === ImplantType.bioware ||
        implant.implantType === "bioware",
    )
    .reduce((sum, implant) => sum + getImplantEffectiveEssenceCost(implant), 0)

  const higherType: ImplantType | null =
    cyberwareTotal === 0 && biowareTotal === 0
      ? null
      : cyberwareTotal >= biowareTotal
        ? ImplantType.cyberware
        : ImplantType.bioware

  const effectiveEssenceUsed =
    higherType === ImplantType.cyberware
      ? cyberwareTotal + biowareTotal * 0.5
      : higherType === ImplantType.bioware
        ? biowareTotal + cyberwareTotal * 0.5
        : 0

  const remainingEssence = BASE_ESSENCE - effectiveEssenceUsed

  return {
    cyberwareTotal,
    biowareTotal,
    higherType,
    effectiveEssenceUsed,
    remainingEssence,
  }
}

export function wouldExceedEssence(
  currentImplants: ImplantFormState[],
  newImplant: ImplantFormState,
): boolean {
  const withNew = [...currentImplants, newImplant]
  const { remainingEssence } = calculateImplantEssence(withNew)
  return remainingEssence <= 0
}
