import type { Combatant } from "#/services/initiativeTracker/initiativeTrackerData.ts"
import {
  addCombatant,
  endRound,
  nextTurn,
  removeCombatant,
  togglePass,
} from "#/services/initiativeTracker/initiativeTrackerSlice.actions.ts"
import {
  selectCurrentTurnId,
  selectRound,
  selectSortedCombatants,
} from "#/services/initiativeTracker/initiativeTrackerSlice.selectors.ts"
import {
  useInitiativeTrackerDispatch,
  useInitiativeTrackerSelector,
} from "#/services/initiativeTracker/initiativeTrackerStore.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

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
