import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Popover from "@mui/material/Popover"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDiceLine, RiFlashlightLine, RiMore2Line } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"

import { selectEdgeCurrent } from "#/components/character/quickPanel/edgeSelectors.ts"
import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import { useDiceTray } from "#/components/dice/diceTrayProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { countHits } from "#/system/dice/diceRoll.ts"

import { InitiativePassTracker } from "./initiativePassTracker.tsx"
import { useInitiative } from "./useInitiative.ts"
import {
  useInitiativeExtraPasses,
  useInitiativeGoingFirst,
  useInitiativePassesCompleted,
  useInitiativePassStore,
  useInitiativeRolledResults,
} from "./useInitiativePassStore.ts"

export const InitiativeSection: FC = () => {
  const { dicePool, initiativePasses: basePasses } = useInitiative()
  const initiativePassStore = useInitiativePassStore()
  const rolledResults = useInitiativeRolledResults(initiativePassStore)
  const passesCompleted = useInitiativePassesCompleted(initiativePassStore)
  const goingFirst = useInitiativeGoingFirst(initiativePassStore)
  const extraPasses = useInitiativeExtraPasses(initiativePassStore)
  const totalPasses = basePasses + extraPasses

  const edgeStore = useEdgeStore()
  const edgeCurrent = useSelector(edgeStore, selectEdgeCurrent)

  const diceTray = useDiceTray()
  const trayOpen = useSelector(diceTray.store, (s) => s.open)
  const trayResults = useSelector(diceTray.store, (s) => s.results)
  const isInitiativeRoll = useRef(false)

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)

  const hits = rolledResults ? countHits(rolledResults) : undefined
  const score = hits !== undefined ? dicePool + hits : undefined

  // When the tray closes after an initiative roll, persist results to the sheet
  useEffect(() => {
    if (!trayOpen && isInitiativeRoll.current) {
      isInitiativeRoll.current = false
      if (trayResults !== null) {
        initiativePassStore.setRolledResults(trayResults)
      }
    }
  }, [trayOpen, trayResults, initiativePassStore])

  const handleRollClick = () => {
    isInitiativeRoll.current = true
    diceTray.setDice(dicePool)
  }

  const handleResetRound = () => initiativePassStore.resetPasses()

  const handleSeizeInitiative = () => {
    edgeStore.setCurrent(edgeCurrent - 1)
    initiativePassStore.setGoingFirst(true)
  }

  const handleCancelGoingFirst = () => {
    if (passesCompleted.size === 0) {
      edgeStore.setCurrent(edgeCurrent + 1)
    }
    initiativePassStore.setGoingFirst(false)
  }

  const handleGainIP = () => {
    edgeStore.setCurrent(edgeCurrent - 1)
    initiativePassStore.gainExtraPass()
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {/* Header */}
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Label label="Initiative" />
        <Button variant="outlined" color="secondary" size="small" onClick={handleResetRound}>
          End Round
        </Button>
      </Stack>

      {/* HUD row */}
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        {/* Score */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            minWidth: "1.5em",
            lineHeight: 1,
            color: score !== undefined ? "text.primary" : "text.disabled",
          }}
        >
          {score ?? "—"}
        </Typography>

        {/* Roll button */}
        <IconButton
          onClick={handleRollClick}
          color="secondary"
          size="small"
          aria-label={`Roll initiative (${dicePool}d6)`}
        >
          <RiDiceLine size={22} />
        </IconButton>

        <Typography variant="caption" color="text.secondary">
          {`${dicePool}d6`}
        </Typography>

        {/* Compact IP dots + Going First badge + popup trigger */}
        <Stack direction="row" sx={{ ml: "auto", alignItems: "center", gap: 0.75 }}>
          {Array.from({ length: totalPasses }, (_, i) => (
            <Box
              key={i}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: passesCompleted.has(i) ? "secondary.main" : "action.disabled",
              }}
            />
          ))}

          {goingFirst && (
            <Chip
              label="1st"
              color="warning"
              size="small"
              sx={{ "height": 18, "fontSize": "0.65rem", "& .MuiChip-label": { px: 0.75 } }}
            />
          )}

          <IconButton
            size="small"
            onClick={(e) => setPopoverAnchor(e.currentTarget)}
            aria-label="Initiative options"
          >
            <RiMore2Line size={18} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Options popover — IP tracker + Edge spending */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        slotProps={{ paper: { sx: { p: 2, minWidth: 220 } } }}
      >
        <Stack sx={{ gap: 2 }}>
          <InitiativePassTracker numPasses={totalPasses} store={initiativePassStore} />

          <Divider />

          <Stack sx={{ gap: 1 }}>
            {goingFirst
              ? (
                <Chip
                  label="Going First"
                  color="warning"
                  variant="filled"
                  size="small"
                  onDelete={handleCancelGoingFirst}
                  sx={{ alignSelf: "flex-start" }}
                />
              )
              : (
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  disabled={edgeCurrent === 0}
                  onClick={handleSeizeInitiative}
                  startIcon={<RiFlashlightLine size={16} />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {`Seize Initiative (${edgeCurrent})`}
                </Button>
              )}

            <Button
              variant="outlined"
              color="warning"
              size="small"
              disabled={edgeCurrent === 0}
              onClick={handleGainIP}
              startIcon={<RiFlashlightLine size={16} />}
              sx={{ alignSelf: "flex-start" }}
            >
              {`Gain IP (${edgeCurrent})`}
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Stack>
  )
}
