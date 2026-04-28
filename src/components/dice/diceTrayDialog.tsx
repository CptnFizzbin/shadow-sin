import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import pluralize from "pluralize"
import type { FC } from "react"

import { selectEdgeCurrent, selectEdgeMax } from "#/components/character/quickPanel/edgeSelectors.ts"
import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { CounterField } from "#/components/ui/counter/counterField.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import {
  selectAllDice,
  selectHits,
  selectIsRolling,
  selectRollState,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"
import { RollState } from "#/system/dice/rollState.ts"

import type { DiceTrayApi } from "./diceTrayApi.ts"

interface DiceTrayDialogProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayDialog: FC<DiceTrayDialogProps> = ({ diceTrayApi }) => {
  const open = useSelector(diceTrayApi.store, (state) => state.open)
  const edgeSpent = useSelector(diceTrayApi.store, (state) => state.edgeSpent)
  const threshold = useSelector(diceTrayApi.store, (state) => state.threshold)

  const dice = useDiceRollerSelector(diceTrayApi.roller, selectAllDice)
  const isRolling = useDiceRollerSelector(diceTrayApi.roller, selectIsRolling)
  const wasRolled = useDiceRollerSelector(diceTrayApi.roller, selectWasRolled)
  const hits = useDiceRollerSelector(diceTrayApi.roller, selectHits)
  const rollState = useDiceRollerSelector(diceTrayApi.roller, selectRollState)

  const edgeStore = useEdgeStore()
  const maxEdge = useSelector(edgeStore, selectEdgeMax)
  const currentEdge = useSelector(edgeStore, selectEdgeCurrent)

  const handleRoll = () => {
    diceTrayApi.reset()
    diceTrayApi.rollStandard()
  }

  const handleReset = () => {
    diceTrayApi.reset()
  }

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
    <Dialog
      open={open}
      onClose={() => diceTrayApi.close()}
      slotProps={{
        transition: {
          onExited: () => diceTrayApi.reset(),
        },
      }}
      fullWidth
    >
      <DialogTitle>Dice Tray</DialogTitle>

      <DialogContent>
        <Stack sx={{ paddingTop: 1 }}>
          <Stack direction="row">
            <CounterField
              value={dice.length}
              onChange={(newValue) => diceTrayApi.setDice(newValue ?? 1)}
              min={1}
              max={32}
              disabled={isRolling}
              label="Dice"
              fullWidth
            />

            <CounterField
              value={threshold}
              onChange={(newValue) => diceTrayApi.setThreshold(newValue ?? 1)}
              min={1}
              max={32}
              disabled={isRolling}
              label="Threshold"
              fullWidth
            />
          </Stack>

          <DiceResult roller={diceTrayApi.roller} iconSize={48} />

          <Stack sx={{ gap: 0 }}>
            {rollState === RollState.Assembling && (
              <Label label="Assembling dice" variant="text" />
            )}

            {rollState === RollState.Rolling && (
              <Label label="Rolling..." color="secondary.dark" variant="text" />
            )}

            {rollState === RollState.Critical && (
              <Label label="CRITICAL GLITCH!" color="error.main" variant="contained" />
            )}

            {rollState === RollState.Glitch && (
              <Label label="Glitch!" color="error.main" variant="text" />
            )}

            {rollState === RollState.Hit && (
              <Label label={hits >= threshold ? "Success!" : "Miss"} variant="text" />
            )}

            {rollState === RollState.Miss && (
              <Label label="Miss" variant="text" />
            )}

            {wasRolled
              ? (
                  <Label label={`${hits} ${pluralize("hit", hits)}`} color="secondary.dark" variant="contained" />
                )
              : (
                  <Label label="-" color="secondary.dark" variant="contained" />
                )}
          </Stack>

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

          <ButtonGroup fullWidth>
            <Button onClick={handleReset} disabled={isRolling}>
              Reset
            </Button>

            <Button variant="contained" onClick={handleRoll} disabled={isRolling}>
              Roll
            </Button>
          </ButtonGroup>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={() => diceTrayApi.close()} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
