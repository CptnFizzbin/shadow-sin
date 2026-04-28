import type { InitiativePassState } from "./initiativePassStore.ts"

export const selectPassesCompleted = (state: InitiativePassState) => state.passesCompleted
