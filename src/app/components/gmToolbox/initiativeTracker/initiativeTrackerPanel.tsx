import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line, RiSkipForwardLine } from "@remixicon/react"
import type { FC } from "react"

import { useInitiativeTracker } from "#/hooks/system/initiativeTracker/useInitiativeTracker.ts"

import { CombatantAvatar } from "./combatantAvatar.tsx"
import { useCombatantDetailDialog } from "./combatantDetailDialog.tsx"
import { useCombatantFormDialog } from "./form/combatantFormDialog.tsx"
import { PassPips } from "./passPips.tsx"

/**
 * A dense, manageable combatant queue: everyone visible at once, sorted by
 * score, current turn called out with a highlight. Tapping a row opens the
 * full stat block in a dialog rather than expanding the row itself, so the
 * roster always stays this compact.
 */
export const InitiativeTrackerPanel: FC = () => {
  const { sortedCombatants, round, currentTurnId, addCombatant, removeCombatant, togglePass, nextTurn, endRound } =
    useInitiativeTracker()
  const combatantDetailDialog = useCombatantDetailDialog()
  const combatantFormDialog = useCombatantFormDialog()

  return (
    <Stack sx={{ padding: 1 }}>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>Round {round}</Typography>
        <Button variant="outlined" color="secondary" onClick={endRound}>End Round</Button>
        <Button variant="contained" color="primary" startIcon={<RiSkipForwardLine />} onClick={nextTurn}>
          Next Turn
        </Button>
      </Stack>

      <Stack>
        {sortedCombatants.length === 0 && (
          <Typography color="text.secondary" sx={{ pl: 1 }}>
            No combatants yet — add one to begin.
          </Typography>
        )}

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

              <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: isCurrent ? "bold" : "normal" }}>
                  {combatant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">Score: {combatant.score}</Typography>
              </Stack>

              <Stack direction="row" sx={{ width: 130, flexShrink: 0 }}>
                <PassPips
                  total={combatant.totalPasses}
                  completed={combatant.passesCompleted}
                  onToggle={(passIndex) => togglePass(combatant.id, passIndex)}
                  highlightCurrent
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
                sx={{ width: 32, flexShrink: 0 }}
              >
                <RiDeleteBin6Line size={16} />
              </IconButton>
            </Stack>
          )
        })}
      </Stack>

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine />}
        onClick={async () => {
          const combatant = await combatantFormDialog.open()
          if (combatant) addCombatant(combatant)
        }}
      >
        Add Unit
      </Button>

      {combatantDetailDialog.outlet}
      {combatantFormDialog.outlet}
    </Stack>
  )
}
