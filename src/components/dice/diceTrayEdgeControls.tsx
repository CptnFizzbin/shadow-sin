import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectEdgeCurrent, selectEdgeMax } from "#/components/character/quickPanel/edgeSelectors.ts"
import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import type { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { Label } from "#/components/ui/text/label.tsx"
import {
  selectIsRolling,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"

interface DiceTrayEdgeControlsProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayEdgeControls: FC<DiceTrayEdgeControlsProps> = ({ diceTrayApi }) => {
  const edgeSpent = useSelector(diceTrayApi.store, (state) => state.edgeSpent)
  const physicalMode = useSelector(diceTrayApi.store, (state) => state.physicalMode)
  const isRolling = useDiceRollerSelector(diceTrayApi.roller, selectIsRolling)
  const wasRolled = useDiceRollerSelector(diceTrayApi.roller, selectWasRolled)

  const edgeStore = useEdgeStore()
  const maxEdge = useSelector(edgeStore, selectEdgeMax)
  const currentEdge = useSelector(edgeStore, selectEdgeCurrent)

  if (physicalMode) return null

  const handleRerollMisses = () => {
    if (diceTrayApi.store.state.edgeSpent) return
    diceTrayApi.rerollMisses()
    edgeStore.setCurrent(currentEdge - 1)
  }

  const handleEdge = () => {
    if (diceTrayApi.store.state.edgeSpent) return
    diceTrayApi.rollEdge(maxEdge)
    edgeStore.setCurrent(currentEdge - 1)
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
