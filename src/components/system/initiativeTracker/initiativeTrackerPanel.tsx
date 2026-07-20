import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiSkipForwardLine } from "@remixicon/react"
import type { FC } from "react"

import { AddCombatantRow } from "./addCombatantRow.tsx"
import { CombatantAvatar } from "./combatantAvatar.tsx"
import { useCombatantDetailDialog } from "./combatantDetailDialog.tsx"
import { PassPips } from "./passPips.tsx"
import { useInitiativeTrackerState } from "./useInitiativeTrackerState.ts"

/**
 * A dense, manageable combatant queue: everyone visible at once, sorted by
 * score, current turn called out with a highlight. Tapping a row opens the
 * full stat block in a dialog rather than expanding the row itself, so the
 * roster always stays this compact.
 */
export const InitiativeTrackerPanel: FC = () => {
  const { sortedCombatants, round, currentTurnId, addCombatant, removeCombatant, togglePass, nextTurn, endRound } =
    useInitiativeTrackerState()
  const combatantDetailDialog = useCombatantDetailDialog()

  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>Round {round}</Typography>
        <Button variant="outlined" color="secondary" onClick={endRound}>End Round</Button>
        <Button variant="contained" color="primary" startIcon={<RiSkipForwardLine />} onClick={nextTurn}>
          Next Turn
        </Button>
      </Stack>

      <Stack sx={{ gap: 1 }}>
        {sortedCombatants.map((combatant) => {
          const isCurrent = combatant.id === currentTurnId
          return (
            <Stack
              key={combatant.id}
              direction="row"
              onClick={() => combatantDetailDialog.open({ combatant })}
              sx={{
                "gap": 1,
                "alignItems": "center",
                "padding": 1,
                "border": "1px solid",
                "borderColor": isCurrent ? "primary.main" : "divider",
                "bgcolor": isCurrent ? "action.selected" : "transparent",
                "cursor": "pointer",
                "&:hover": { bgcolor: isCurrent ? "action.selected" : "action.hover" },
              }}
            >
              <CombatantAvatar name={combatant.name} isPC={combatant.isPC} />

              <Stack sx={{ minWidth: 96 }}>
                <Typography sx={{ fontWeight: isCurrent ? "bold" : "normal" }}>{combatant.name}</Typography>
                <Typography variant="body2" color="text.secondary">Score: {combatant.score}</Typography>
              </Stack>

              <Stack direction="row" sx={{ gap: 0.5, flexGrow: 1, justifyContent: "center" }}>
                <PassPips
                  total={combatant.totalPasses}
                  completed={combatant.passesCompleted}
                  onToggle={(passIndex) => togglePass(combatant.id, passIndex)}
                />
              </Stack>

              <IconButton
                size="small"
                color="error"
                aria-label={`Remove ${combatant.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  removeCombatant(combatant.id)
                }}
              >
                <RiDeleteBin6Line size={16} />
              </IconButton>
            </Stack>
          )
        })}
      </Stack>

      <AddCombatantRow onAdd={addCombatant} />

      {combatantDetailDialog.dialog}
    </Stack>
  )
}
