import { createContext, useContext } from "react"

import type { DiceTrayApi } from "./diceTrayApi.ts"

export const DiceTrayContext = createContext<DiceTrayApi | null>(null)

/**
 * Returns the nearest {@link DiceTrayApi} instance from context.
 * Must be used within a {@link DiceTrayProvider}.
 *
 * ```ts
 * const diceTray = useDiceTray()
 * diceTray.roll(pool.size)
 * ```
 */
export const useDiceTray = (): DiceTrayApi => {
  const diceTrayApi = useContext(DiceTrayContext)

  if (!diceTrayApi) {
    throw new Error("useDiceTray must be used within a DiceTrayProvider")
  }

  return diceTrayApi
}
