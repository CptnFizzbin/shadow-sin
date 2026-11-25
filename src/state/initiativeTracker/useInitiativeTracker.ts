import type { UUID } from "#/common/uuid/uuidUtils.ts"

import type { Combatant } from "./initiativeTrackerData.ts"
import {
  addCombatant,
  endRound,
  nextTurn,
  removeCombatant,
  togglePass,
} from "./initiativeTrackerSlice.actions.ts"
import {
  selectCurrentTurnId,
  selectRound,
  selectSortedCombatants,
} from "./initiativeTrackerSlice.selectors.ts"
import {
  useInitiativeTrackerDispatch,
  useInitiativeTrackerSelector,
} from "./initiativeTrackerStore.ts"

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
