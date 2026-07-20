import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiRestartLine, RiSkipForwardLine } from "@remixicon/react"
import type { FC } from "react"

import { AddCombatantRow } from "./addCombatantRow.tsx"
import { CombatantAvatar } from "./combatantAvatar.tsx"
import { PassPips } from "./passPips.tsx"
import { useInitiativeTrackerState } from "./useInitiativeTrackerState.ts"

/**
 * Variant C — a spotlight for running combat live on a shared screen. Only
 * one combatant is ever front-and-center; everyone else is a queue strip or
 * tucked into a collapsed roster, minimizing what the table has to parse
 * on any given turn.
 */
export const InitiativeTrackerSpotlightVariant: FC = () => {
  const { sortedCombatants, round, currentTurnId, addCombatant, removeCombatant, togglePass, nextTurn, endRound } =
    useInitiativeTrackerState()

  const currentIndex = sortedCombatants.findIndex((combatant) => combatant.id === currentTurnId)
  const current = sortedCombatants[currentIndex]
  const upNext = [
    ...sortedCombatants.slice(currentIndex + 1),
    ...sortedCombatants.slice(0, currentIndex),
  ]

  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <Typography variant="h5" sx={{ textAlign: "center" }}>Round {round}</Typography>

      {current
        ? (
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                borderColor: "primary.main",
                boxShadow: "0 0 16px",
                color: "primary.main",
              }}
            >
              <Stack sx={{ gap: 1, alignItems: "center" }}>
                <CombatantAvatar name={current.name} isPC={current.isPC} size={64} />
                <Typography variant="h3">{current.name}</Typography>
                <Typography variant="h4" color="text.primary">Score: {current.score}</Typography>
                <PassPips
                  total={current.totalPasses}
                  completed={current.passesCompleted}
                  onToggle={(passIndex) => togglePass(current.id, passIndex)}
                />
              </Stack>
            </Paper>
          )
        : (
            <Typography sx={{ textAlign: "center" }} color="text.secondary">
              Add a combatant to begin.
            </Typography>
          )}

      <Stack direction="row" sx={{ gap: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RiRestartLine />}
          onClick={endRound}
          sx={{ flexGrow: 1 }}
        >
          End Round
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<RiSkipForwardLine />}
          onClick={nextTurn}
          sx={{ flexGrow: 1 }}
        >
          Next Turn
        </Button>
      </Stack>

      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="overline" color="text.secondary">On Deck</Typography>
        <Stack direction="row" sx={{ gap: 1, overflowX: "auto", paddingBottom: 0.5 }}>
          {upNext.map((combatant) => (
            <Stack key={combatant.id} sx={{ gap: 0.5, alignItems: "center", minWidth: 64 }}>
              <CombatantAvatar name={combatant.name} isPC={combatant.isPC} />
              <Typography variant="body2" noWrap sx={{ maxWidth: 64 }}>{combatant.name}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <AccordionSummary expandIcon={<RiArrowDownSLine />}>
          <Typography>Full Roster ({sortedCombatants.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ gap: 1 }}>
            {sortedCombatants.map((combatant) => (
              <Stack key={combatant.id} direction="row" sx={{ gap: 1, alignItems: "center" }}>
                <CombatantAvatar name={combatant.name} isPC={combatant.isPC} />
                <Typography sx={{ flexGrow: 1 }}>{combatant.name}</Typography>
                <Typography color="text.secondary">{combatant.score}</Typography>
                <Button size="small" color="error" onClick={() => removeCombatant(combatant.id)}>
                  Remove
                </Button>
              </Stack>
            ))}

            <AddCombatantRow onAdd={addCombatant} />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  )
}
