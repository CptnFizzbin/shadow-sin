import type { UUID } from "node:crypto"

import type { Combatant } from "#/lib/stores/initiativeTracker/initiativeTrackerData.ts"
import {
  addCombatant,
  endRound,
  nextTurn,
  removeCombatant,
  togglePass,
} from "#/lib/stores/initiativeTracker/initiativeTrackerSlice.actions.ts"
import {
  selectCurrentTurnId,
  selectRound,
  selectSortedCombatants,
} from "#/lib/stores/initiativeTracker/initiativeTrackerSlice.selectors.ts"
import {
  useInitiativeTrackerDispatch,
  useInitiativeTrackerSelector,
} from "#/lib/stores/initiativeTracker/initiativeTrackerStore.ts"

export const useInitiativeTracker = () => {
  const dispatch = useInitiativeTrackerDispatch()
  const sortedCombatants = useInitiativeTrackerSelector(selectSortedCombatants)
  const round = useInitiativeTrackerSelector(selectRound)
  const currentTurnId = useInitiativeTrackerSelector(selectCurrentTurnId)

  return {
    sortedCombatants,
    round,
    currentTurnId,
    addCombatant: (input: Omit<Combatant, "id" | "passesCompleted">) => dispatch(addCombatant(input)),
    removeCombatant: (id: UUID) => dispatch(removeCombatant(id)),
    togglePass: (id: UUID, passIndex: number) => dispatch(togglePass({ id, passIndex })),
    nextTurn: () => dispatch(nextTurn()),
    endRound: () => dispatch(endRound()),
  }
}
