import { createContext, useContext } from "react"

// True when editing an existing runner (as opposed to creating a new one), where
// build-point budgets are creation-time guardrails that no longer apply.
export const EditModeContext = createContext(false)

export const useIsEditMode = (): boolean => useContext(EditModeContext)
