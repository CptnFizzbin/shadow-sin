/**
 * Optional rules that adjust SR4e mechanics. Stored per-character so different
 * Runners can represent different campaigns. A `GameConfig` may override SR4e
 * defaults; character-level settings then override the GameConfig.
 */
export interface HouseRules {
  /**
   * Number of damage boxes per −1 wound modifier. SR4e default is 3.
   * The literal union lets the UI render exactly two options and lets
   * TypeScript exhaustively check consumers.
   */
  woundModifierInterval: 3 | 4

  /**
   * Whether to apply encumbrance penalties from carried weight. SR4e
   * default is true.
   */
  encumbranceEnabled: boolean
}

export const defaultHouseRules: HouseRules = {
  woundModifierInterval: 3,
  encumbranceEnabled: true,
}
