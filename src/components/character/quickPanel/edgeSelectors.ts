import type { EdgeStoreState } from "#/components/character/quickPanel/edgeStore.ts"

export const selectEdgeMax = (state: EdgeStoreState) => state.max
export const selectEdgeCurrent = (state: EdgeStoreState) => state.current
