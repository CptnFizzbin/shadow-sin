import type { UUID } from "#/lib/uuidUtils.ts"
import type { Combatant } from "#/stores/initiativeTracker/initiativeTrackerData.ts"
import {
  addCombatant,
  endRound,
  nextTurn,
  removeCombatant,
  togglePass,
} from "#/stores/initiativeTracker/initiativeTrackerSlice.actions.ts"
import {
  selectCurrentTurnId,
  selectRound,
  selectSortedCombatants,
} from "#/stores/initiativeTracker/initiativeTrackerSlice.selectors.ts"
import {
  useInitiativeTrackerDispatch,
  useInitiativeTrackerSelector,
} from "#/stores/initiativeTracker/initiativeTrackerStore.ts"

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
