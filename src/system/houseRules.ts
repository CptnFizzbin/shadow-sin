import { z } from "zod"

/**
 * Optional rules that adjust SR4e mechanics. A `HouseRules` value carries
 * only the overrides that differ from SR4e defaults; an unset field means
 * "use the SR4e default". Consumers merge against {@link defaultHouseRules}
 * at the call site (sr4eDefaults → gmConfig.houseRules → character.houseRules).
 */
export interface HouseRules {
  /**
   * Number of damage boxes per −1 wound modifier. SR4e default is 3.
   * `4` is a placeholder for the #290 tracer bullet, not a published rule.
   * The literal union lets the UI render exactly two options and lets
   * TypeScript exhaustively check consumers.
   */
  woundModifierInterval?: 3 | 4

  /**
   * Whether to apply encumbrance penalties from carried weight. SR4e
   * default is true.
   */
  encumbranceEnabled?: boolean
}

export const HouseRulesSchema = z.object({
  woundModifierInterval: z.union([z.literal(3), z.literal(4)]).optional(),
  encumbranceEnabled: z.boolean().optional(),
}) satisfies z.ZodType<HouseRules>

export const defaultHouseRules: Required<HouseRules> = {
  woundModifierInterval: 3,
  encumbranceEnabled: true,
}
