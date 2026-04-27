import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useEffect } from "react"

import { selectEdgeCurrent } from "#/components/character/quickPanel/edgeSelectors.ts"
import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import type { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import type { DiceResultsInfo } from "#/components/system/dice/diceResultsInfo.tsx"
import { countHits, isCriticalGlitch, isGlitch } from "#/system/dice/diceRoll.ts"

interface DiceTrayDialogProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayDialog: FC<DiceTrayDialogProps> = ({ diceTrayApi }) => {
  const open = useStore(diceTrayApi.store, (state) => state.open)
  const diceCount = useStore(diceTrayApi.store, (state) => state.diceCount)
  const autoRoll = useStore(diceTrayApi.store, (state) => state.autoRoll)
  const results = useStore(diceTrayApi.store, (state) => state.results)
  const isRolling = useStore(diceTrayApi.store, (state) => state.isRolling)

  const edgeStore = useEdgeStore()
  const edgeCurrent = useStore(edgeStore, selectEdgeCurrent)

  // When the tray is opened via .roll(), auto-roll immediately.
  useEffect(() => {
    if (open && autoRoll) {
      diceTrayApi.rollStandard()
    }
  }, [open, autoRoll, diceTrayApi])

  const handleRoll = () => diceTrayApi.rollStandard()

  const handleEdge = () => {
    edgeStore.setCurrent((current) => current - 1)
    diceTrayApi.rollEdge()
  }

  const handleSecondChance = () => {
    edgeStore.setCurrent((current) => current - 1)
    diceTrayApi.rollSecondChance()
  }

  const criticalGlitch = results !== null && isCriticalGlitch(results)
  const glitch = results !== null && !criticalGlitch && isGlitch(results)

  const diceResultsInfo: DiceResultsInfo = {
    values: results ?? Array.from({ length: diceCount }, () => 0),
    isRolling,
    hits: results !== null ? countHits(results) : 0,
    isGlitch: criticalGlitch ? "critical" : glitch,
  }

  return (
    <Dialog open={open} onClose={() => diceTrayApi.close()} fullWidth>
      <DialogTitle>Dice Tray</DialogTitle>

      <DialogContent>
        <Stack sx={{ gap: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => diceTrayApi.setDiceCount(diceCount - 1)}
              disabled={diceCount <= 1 || isRolling}
              aria-label="Decrease dice"
            >
              <RemoveIcon />
            </IconButton>

            <Typography variant="h4" sx={{ minWidth: "2em", textAlign: "center" }}>
              {diceCount}
            </Typography>

            <IconButton
              onClick={() => diceTrayApi.setDiceCount(diceCount + 1)}
              disabled={isRolling}
              aria-label="Increase dice"
            >
              <AddIcon />
            </IconButton>
          </Stack>

          <DiceResult results={diceResultsInfo} />

          {results !== null && !isRolling && (
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
              <Typography variant="body2">
                {countHits(results)} hits
              </Typography>

              {criticalGlitch && (
                <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>
                  CRITICAL GLITCH!
                </Typography>
              )}

              {glitch && (
                <Typography variant="body2" color="error">
                  Glitch!
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        {results === null
          ? (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleEdge}
                disabled={edgeCurrent <= 0 || isRolling}
              >
                Push Edge ({edgeCurrent})
              </Button>
            )
          : (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleSecondChance}
                disabled={edgeCurrent <= 0 || isRolling}
              >
                2nd Chance ({edgeCurrent})
              </Button>
            )}

        <Button variant="contained" onClick={handleRoll} disabled={isRolling}>
          Roll {diceCount}d6
        </Button>

        <Button onClick={() => diceTrayApi.close()}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
