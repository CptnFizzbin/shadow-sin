import { createContext } from "react"

import type { BuilderStore } from "#/state/builder/builderStore.ts"

export const BuilderStoreContext = createContext<BuilderStore | null>(null)
