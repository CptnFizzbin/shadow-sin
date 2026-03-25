import { createContext } from "react"

import type { GearApi } from "#/lib/gear/GearApi.ts"

export const GearContext = createContext<GearApi | null>(null)
