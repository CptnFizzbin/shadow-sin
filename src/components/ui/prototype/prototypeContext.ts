// fallow-ignore-file
import { createContext } from "react"

/** Name of the currently selected `Prototype.Item` group, or `null` if there are none. */
export const PrototypeSelectionContext = createContext<string | null>(null)
