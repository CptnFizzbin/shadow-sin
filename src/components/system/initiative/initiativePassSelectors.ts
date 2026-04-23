import type { InitiativePassState } from "#/components/system/initiative/initiativePassStore.ts"

export const selectPassesCompleted = (state: InitiativePassState) => state.passesCompleted
