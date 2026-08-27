import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import { purple } from "@mui/material/colors"
import { sort } from "fast-sort"
import type { FC } from "react"
import { useState } from "react"

import { ReputationSelectors } from "#/stores/runner/reputation/reputationSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

/**
 * Per-stat chip identity plus which color an entry's signed value takes on — not the same
 * polarity for every stat. Street Cred going up is good (green); Notoriety going up is bad
 * (red), so its polarity is the inverse of Street Cred's. Public Awareness doesn't map to
 * good/bad at all, so it gets its own pair (blue/purple) rather than borrowing green/red.
 */
const STAT_CONFIG: Record<ReputationStatType, {
  label: string
  chipColor: string
  positiveColor: string
  negativeColor: string
}> = {
  streetCred: {
    label: "Street Cred",
    chipColor: "success.main",
    positiveColor: "success.main",
    negativeColor: "error.main",
  },
  notoriety: {
    label: "Notoriety",
    chipColor: "error.main",
    positiveColor: "error.main",
    negativeColor: "success.main",
  },
  publicAwarenessModifier: {
    label: "Public Awareness",
    chipColor: purple[400],
    positiveColor: "info.main",
    negativeColor: purple[400],
  },
}

const ALL_STATS = Object.keys(STAT_CONFIG) as ReputationStatType[]

export const ReputationLedgerList: FC = () => {
  const ledger = useRunnerSelector(ReputationSelectors.selectLedger)
  const [visibleStats, setVisibleStats] = useState<ReputationStatType[]>(ALL_STATS)

  const handleVisibleStatsChange = (_: unknown, newStats: ReputationStatType[]) => {
    setVisibleStats(newStats)
  }

  const filteredLedger = ledger.filter((entry) => visibleStats.includes(entry.stat))
  // Newest first, by when the entry was actually written — not just array/insertion order.
  const sortedLedger = sort(filteredLedger).desc((entry) => new Date(entry.timestamp).getTime())

  return (
    <Stack sx={{ gap: 1 }}>
      <ToggleButtonGroup value={visibleStats} onChange={handleVisibleStatsChange} size="small" sx={{ flexWrap: "wrap" }}>
        {ALL_STATS.map((stat) => {
          const config = STAT_CONFIG[stat]
          return (
            <ToggleButton
              key={stat}
              value={stat}
              sx={{
                "color": "text.secondary",
                "borderColor": "divider",
                "&.Mui-selected": {
                  color: config.chipColor,
                  borderColor: config.chipColor,
                  backgroundColor: "transparent",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {config.label}
            </ToggleButton>
          )
        })}
      </ToggleButtonGroup>

      {sortedLedger.length === 0
        ? (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
              {ledger.length === 0 ? "No reputation events recorded yet" : "No entries match the selected filters"}
            </Typography>
          )
        : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell>Stat</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedLedger.map((entry) => {
                    const config = STAT_CONFIG[entry.stat]
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Chip
                            label={config.label}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: config.chipColor, color: config.chipColor }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: entry.amount > 0 ? config.positiveColor : config.negativeColor,
                            }}
                          >
                            {entry.amount > 0 ? "+" : ""}{entry.amount}
                          </Typography>
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell sx={{ fontSize: "0.875rem", color: "textSecondary" }}>
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
    </Stack>
  )
}
