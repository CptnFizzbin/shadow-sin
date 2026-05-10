import type { AdeptPowerData } from "./adeptPowerData.ts"
import type { CritterPowerData } from "./critterPowerData.ts"
import type { PowerData } from "./powerData.ts"

export type AnyPowerData =
  | PowerData
  | AdeptPowerData
  | CritterPowerData
