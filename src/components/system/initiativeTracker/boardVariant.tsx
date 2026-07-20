import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiCloseLine, RiRestartLine, RiSkipForwardLine } from "@remixicon/react"
import type { FC } from "react"

import { AddCombatantRow } from "./addCombatantRow.tsx"
import { CombatantAvatar } from "./combatantAvatar.tsx"
import { PassPips } from "./passPips.tsx"
import { useInitiativeTrackerState } from "./useInitiativeTrackerState.ts"

/**
 * Variant B — a battle board. Every combatant gets equal visual weight in a
 * card grid, optimized for a GM screen glanced at from across the table
 * rather than scanned top-to-bottom like a list.
 */
export const InitiativeTrackerBoardVariant: FC = () => {
  const { sortedCombatants, round, currentTurnId, addCombatant, removeCombatant, togglePass, nextTurn, endRound } =
    useInitiativeTrackerState()

  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Round {round}</Typography>
        <IconButton color="secondary" aria-label="End round" onClick={endRound}>
          <RiRestartLine />
        </IconButton>
        <Button variant="contained" color="primary" startIcon={<RiSkipForwardLine />} onClick={nextTurn}>
          Next Turn
        </Button>
      </Stack>

      <Grid container spacing={1}>
        {sortedCombatants.map((combatant) => {
          const isCurrent = combatant.id === currentTurnId
          return (
            <Grid key={combatant.id} size={{ xs: 6, sm: 4 }}>
              <Paper
                sx={{
                  padding: 1,
                  height: "100%",
                  borderColor: isCurrent ? "primary.main" : "divider",
                  boxShadow: isCurrent ? "0 0 12px" : "none",
                  color: isCurrent ? "primary.main" : "inherit",
                }}
              >
                <Stack sx={{ gap: 1, alignItems: "center" }}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: "center", width: "100%" }}>
                    <CombatantAvatar name={combatant.name} isPC={combatant.isPC} current={isCurrent} />
                    <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>{combatant.name}</Typography>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Remove ${combatant.name}`}
                      onClick={() => removeCombatant(combatant.id)}
                    >
                      <RiCloseLine size={16} />
                    </IconButton>
                  </Stack>

                  <Typography variant="h3">{combatant.score}</Typography>

                  <PassPips
                    total={combatant.totalPasses}
                    completed={combatant.passesCompleted}
                    onToggle={(passIndex) => togglePass(combatant.id, passIndex)}
                  />
                </Stack>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      <AddCombatantRow onAdd={addCombatant} />
    </Stack>
  )
}
