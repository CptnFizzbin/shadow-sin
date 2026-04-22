import type { BiologyState } from "#/components/biology/biologyStore.ts"

export const selectMetatype = (state: BiologyState) => state.metatype
export const selectAwakening = (state: BiologyState) => state.awakening
