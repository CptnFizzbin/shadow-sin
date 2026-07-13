import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import type { FC } from "react"

import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import {
  selectHits,
  selectIsRolling,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"

import { useDiceTray } from "./diceTrayContext.ts"
import { TestType } from "./testType.ts"

export const DiceTrayActions: FC = () => {
  const diceTrayApi = useDiceTray()
  const testType = useSelector(diceTrayApi.store, (state) => state.testType)
  const physicalMode = useSelector(diceTrayApi.store, (state) => state.physicalMode)
  const physicalHits = useSelector(diceTrayApi.store, (state) => state.physicalHits)

  const isRolling = useDiceRollerSelector(diceTrayApi.roller, selectIsRolling)
  const wasRolled = useDiceRollerSelector(diceTrayApi.roller, selectWasRolled)
  const rolledHits = useDiceRollerSelector(diceTrayApi.roller, selectHits)

  const isExtendedTest = testType === TestType.Extended

  const handleReset = () => {
    diceTrayApi.reset()
    if (physicalMode) {
      diceTrayApi.setPhysicalHits(0)
    }
  }

  const handleRoll = () => {
    if (isExtendedTest) {
      // In an extended test, "Roll" commits the current roll into history
      // before starting the next intermediate roll. This unifies "Next Roll"
      // and "Roll" into a single action. In physical mode the user explicitly
      // presses Roll so any value (including 0 hits) is intentional.
      const hadResult = physicalMode || wasRolled
      if (hadResult) {
        const currentHits = physicalMode ? physicalHits : rolledHits
        diceTrayApi.recordExtendedRoll(currentHits)
        if (physicalMode) {
          diceTrayApi.setPhysicalHits(0)
          return
        }
      }
      diceTrayApi.rollStandard()
      return
    }

    if (physicalMode) return

    diceTrayApi.reset()
    diceTrayApi.rollStandard()
  }

  // The Roll button is hidden for non-extended physical tests since there is
  // nothing to roll — the user enters hits manually.
  const showRollButton = !physicalMode || isExtendedTest

  return (
    <ButtonGroup fullWidth>
      <Button onClick={handleReset} disabled={!physicalMode && isRolling}>
        Reset
      </Button>

      {showRollButton && (
        <Button variant="contained" onClick={handleRoll} disabled={!physicalMode && isRolling}>
          Roll
        </Button>
      )}
    </ButtonGroup>
  )
}
