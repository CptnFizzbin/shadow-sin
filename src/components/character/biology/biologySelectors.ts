import type { BiologyState } from "#/components/character/biology/biologyStore.ts"

export const selectMetatype = (state: BiologyState) => state.metatype
export const selectAwakening = (state: BiologyState) => state.awakening
