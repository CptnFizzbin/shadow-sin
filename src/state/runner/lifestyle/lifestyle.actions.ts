import { createAction } from "@reduxjs/toolkit"

import type { LifestyleType } from "#/system/model/finances/lifestyleType.ts"
import type { RunnerLifestyle } from "#/system/model/finances/runnerLifestyle.ts"

/** Switches to a standard lifestyle, keeping the prepaid months and notes. */
export const setStandardLifestyle = createAction<LifestyleType>("lifestyle/setStandard")

/** Overwrites the given lifestyle fields. */
export const patchLifestyle = createAction<Partial<RunnerLifestyle>>("lifestyle/patch")

/** Sets the number of months of upkeep paid in advance. */
export const setLifestyleMonthsPaid = createAction<number>("lifestyle/setMonthsPaid")

/**
 * Prepays `months` more months of upkeep, withdrawing `nuyenCost` from the Runner's nuyen in the same write. See
 * `lifestylePrepayCost` for the cost of a prepayment.
 */
export const prepayLifestyle = createAction<{ months: number, nuyenCost: number }>("lifestyle/prepay")
