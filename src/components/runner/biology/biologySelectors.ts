import type { BiologyState } from "./biologyStore.ts"

export const selectMetatype = (state: BiologyState) => state.metatype
export const selectAwakening = (state: BiologyState) => state.awakening
