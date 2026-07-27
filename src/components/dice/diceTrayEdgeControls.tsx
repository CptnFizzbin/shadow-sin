import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import { useDiceTray } from "#/lib/contexts/dice/diceTrayContext.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import {
  selectIsRolling,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"

export const DiceTrayEdgeControls: FC = () => {
  const diceTrayApi = useDiceTray()
  const edgeSpent = useSelector(diceTrayApi.store, (state) => state.edgeSpent)
  const physicalMode = useSelector(diceTrayApi.store, (state) => state.physicalMode)
  const isRolling = useDiceRollerSelector(diceTrayApi.roller, selectIsRolling)
  const wasRolled = useDiceRollerSelector(diceTrayApi.roller, selectWasRolled)

  const dispatch = useRunnerStoreDispatch()
  const maxEdge = useRunnerStoreSelector(Selectors.edge.selectEdgeMax)
  const currentEdge = useRunnerStoreSelector(Selectors.edge.selectEdgeCurrent)

  if (physicalMode) return null

  const handleRerollMisses = () => {
    if (diceTrayApi.store.state.edgeSpent) return
    diceTrayApi.rerollMisses()
    dispatch(Actions.edge.setCurrentEdge(currentEdge - 1))
  }

  const handleEdge = () => {
    if (diceTrayApi.store.state.edgeSpent) return
    diceTrayApi.rollEdge(maxEdge)
    dispatch(Actions.edge.setCurrentEdge(currentEdge - 1))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Label color="warning.main">Edge ({currentEdge}/{maxEdge})</Label>

      <ButtonGroup fullWidth>
        <Button
          color="warning"
          onClick={handleRerollMisses}
          disabled={currentEdge <= 0 || edgeSpent || isRolling || !wasRolled}
        >
          Reroll Misses
        </Button>

        <Button
          color="warning"
          onClick={handleEdge}
          disabled={currentEdge <= 0 || edgeSpent || isRolling}
        >
          Roll Edge
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
