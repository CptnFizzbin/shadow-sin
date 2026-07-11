import { useContext } from "react"

import { IsBuilderContext } from "./isBuilderContext.ts"

/**
 * Returns true when rendered inside a RunnerBuilderStoreProvider.
 * Used by gear form dialogs to switch between builder (save only) and
 * play-mode (acquire / purchase) behaviour.
 */
export const useIsBuilder = (): boolean => useContext(IsBuilderContext)
