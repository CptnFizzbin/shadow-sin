import type { UUID } from "node:crypto"

import { createSelector } from "reselect"

import type { Combatant, InitiativeTrackerState } from "./initiativeTrackerData.ts"
import { sortCombatants } from "./initiativeTrackerData.ts"

export function selectCombatants(state: InitiativeTrackerState): Combatant[] {
  return state.combatants
}

export const selectSortedCombatants = createSelector(
  selectCombatants,
  (combatants) => sortCombatants(combatants),
)

export function selectRound(state: InitiativeTrackerState): number {
  return state.round
}

export function selectCurrentTurnId(state: InitiativeTrackerState): UUID | null {
  return state.currentTurnId
}
