// fallow-ignore-file
import { createContext } from "react"

/** `key` of the currently selected version from the enclosing `Prototype`'s `versions` list, or `null` if there are none. */
export const PrototypeSelectionContext = createContext<string | null>(null)
