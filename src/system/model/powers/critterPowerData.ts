import type { PowerData } from "./powerData.ts"

/**
 * Represents an innate critter power.
 */
export interface CritterPowerData extends PowerData {
  type: "critterPower"
}
