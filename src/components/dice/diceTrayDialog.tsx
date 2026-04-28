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
import { useEffect } from "react"

import { selectEdgeCurrent, selectEdgeMax } from "#/components/character/quickPanel/edgeSelectors.ts"
import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import { getDiceOffset } from "#/components/system/dice/diceUtils.ts"
import { DieFace } from "#/components/system/dice/dieFace.tsx"
import { CounterField } from "#/components/ui/counter/counterField.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { RollState } from "#/system/dice/rollState.ts"

import type { DiceTrayApi } from "./diceTrayApi.ts"

interface DiceTrayDialogProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayDialog: FC<DiceTrayDialogProps> = ({ diceTrayApi }) => {
  const open = useSelector(diceTrayApi.store, (s) => s.open)
  const edgeSpent = useSelector(diceTrayApi.store, (s) => s.edgeSpent)
  const threshold = useSelector(diceTrayApi.store, (s) => s.threshold)
  const diceCount = useSelector(diceTrayApi.store, (s) => s.diceCount)
  const results = useSelector(diceTrayApi.store, (s) => s.results)
  const isRolling = useSelector(diceTrayApi.store, (s) => s.isRolling)
  const autoRoll = useSelector(diceTrayApi.store, (s) => s.autoRoll)

  const edgeStore = useEdgeStore()
  const maxEdge = useSelector(edgeStore, selectEdgeMax)
  const currentEdge = useSelector(edgeStore, selectEdgeCurrent)

  useEffect(() => {
    if (autoRoll) {
      diceTrayApi.rollStandard()
    }
  }, [autoRoll, diceTrayApi])

  const wasRolled = results !== null
  const hits = wasRolled ? results.filter((r) => r >= 5).length : 0
  const ones = wasRolled ? results.filter((r) => r === 1).length : 0
  const isGlitch = wasRolled && results.length > 0 && ones >= results.length / 2
  const isCriticalGlitch = isGlitch && hits === 0

  const rollState: RollState = !wasRolled
    ? RollState.Assembling
    : isRolling
      ? RollState.Rolling
      : isCriticalGlitch
        ? RollState.Critical
        : isGlitch
          ? RollState.Glitch
          : hits >= 1
            ? RollState.Hit
            : RollState.Miss

  const diceDefaultColor = (isGlitch && wasRolled) ? "error.main" : "secondary.main"

  const handleRoll = () => diceTrayApi.rollStandard()
  const handleReset = () => diceTrayApi.reset()

  const handleRerollMisses = () => {
    if (diceTrayApi.store.state.edgeSpent) return
    diceTrayApi.rollSecondChance()
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
              value={diceCount}
              onChange={(newValue) => diceTrayApi.setDiceCount(newValue ?? 1)}
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

          <Stack
            direction="row"
            sx={{
              flexWrap: "wrap",
              gap: 0,
              color: diceDefaultColor,
              margin: "auto",
              justifyContent: "center",
            }}
          >
            {wasRolled && results.map((value, index) => (
              <DieFace
                key={index}
                value={value}
                style={getDiceOffset(isRolling)}
                size={48}
              />
            ))}
            {!wasRolled && Array.from({ length: diceCount }).map((_, index) => (
              <DieFace key={index} value={null} size={48} />
            ))}
          </Stack>

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
