import { Lifestyles, LifestyleType } from "./lifestyleType.ts"

/** The Runner's current lifestyle: a standard SR4 lifestyle or a custom one with a hand-set upkeep. */
export interface RunnerLifestyle {
  /** Display name — a {@link LifestyleType} for a standard lifestyle, or any name for a custom one. */
  name: string
  /** Monthly cost in nuyen. Negative for a monthly income (e.g. the Trust Fund quality). */
  upkeep: number
  /** Months of upkeep already paid in advance. Only meaningful while `upkeep` is positive. */
  monthsPaid: number
  /** Free-form player notes about the lifestyle. */
  notes?: string
}

/** Builds the {@link RunnerLifestyle} for a standard lifestyle, keeping the given prepaid months and notes. */
export function standardLifestyle(
  type: LifestyleType,
  rest: Pick<RunnerLifestyle, "monthsPaid" | "notes"> = { monthsPaid: 1 },
): RunnerLifestyle {
  return { ...rest, name: type, upkeep: Lifestyles[type].upkeep }
}

/**
 * Returns the standard {@link LifestyleType} `lifestyle` matches by both name and upkeep, or `null` when it's a
 * custom lifestyle.
 */
export function matchStandardLifestyle(lifestyle: Pick<RunnerLifestyle, "name" | "upkeep">): LifestyleType | null {
  const match = Object.values(Lifestyles).find((info) => info.name === lifestyle.name)
  return match && match.upkeep === lifestyle.upkeep ? match.name : null
}

/**
 * The standard lifestyle whose starting-nuyen roll applies to `lifestyle`: the lifestyle itself when standard,
 * otherwise the most expensive standard lifestyle whose upkeep doesn't exceed the custom upkeep (Street for an
 * income).
 */
export function startingNuyenLifestyle(lifestyle: Pick<RunnerLifestyle, "name" | "upkeep">): LifestyleType {
  const standard = matchStandardLifestyle(lifestyle)
  if (standard) return standard

  return Object.values(Lifestyles)
    .filter((info) => info.upkeep <= lifestyle.upkeep)
    .reduce((best, info) => (info.upkeep > best.upkeep ? info : best), Lifestyles[LifestyleType.Street])
    .name
}

/** Whether `lifestyle` has a monthly cost that can be prepaid. */
export function hasLifestyleUpkeep(lifestyle: Pick<RunnerLifestyle, "upkeep">): boolean {
  return lifestyle.upkeep > 0
}

/** Nuyen cost of prepaying `months` months of `lifestyle`'s upkeep; zero when it has no upkeep to prepay. */
export function lifestylePrepayCost(lifestyle: Pick<RunnerLifestyle, "upkeep">, months: number): number {
  return Math.max(0, lifestyle.upkeep) * Math.max(0, months)
}
