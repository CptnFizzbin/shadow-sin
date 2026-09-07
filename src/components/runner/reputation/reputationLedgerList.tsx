import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import { sort } from "fast-sort"
import type { FC } from "react"

import { Icons } from "#/lib/icons.ts"
import { ReputationSelectors } from "#/stores/runner/reputation/reputationSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ReputationLedgerEntry } from "#/system/reputation/reputationLedgerEntry.ts"
import { ReputationStatTypeData } from "#/system/reputation/reputationLedgerEntry.ts"

import type { ReputationFilter } from "./reputationLedgerFilters.tsx"

interface ReputationLedgerListProps {
  filters?: ReputationFilter
  onEdit?: (entry: ReputationLedgerEntry) => void
  onDelete?: (entry: ReputationLedgerEntry) => void
}

export const ReputationLedgerList: FC<ReputationLedgerListProps> = ({ filters, onEdit, onDelete }) => {
  const hasActions = !!(onEdit || onDelete)

  const ledger = useRunnerSelector(ReputationSelectors.selectLedger)

  const filteredLedger = filters
    ? ledger.filter((entry) => filters.statTypes.includes(entry.stat))
    : ledger

  // Newest first, by when the entry was actually written — not just array/insertion order.
  const sortedLedger = sort(filteredLedger).desc((entry) => new Date(entry.timestamp).getTime())

  return (
    <Stack sx={{ gap: 1 }}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell>Stat</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              {hasActions && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLedger.map((entry) => {
              const config = ReputationStatTypeData[entry.stat]
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
                  {hasActions && (
                    <TableCell align="right">
                      <Stack direction="row">
                        {onEdit && (
                          <IconButton
                            size="small"
                            aria-label={`Edit ${config.label} entry`}
                            onClick={() => onEdit(entry)}
                          >
                            <Icons.Edit size={18} />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            size="small"
                            aria-label={`Delete ${config.label} entry`}
                            onClick={() => onDelete(entry)}
                          >
                            <Icons.Delete size={18} />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {sortedLedger.length === 0 && (
        <Typography color="textSecondary" sx={{ textAlign: "center" }}>
          {ledger.length === 0 ? "No reputation events recorded yet" : "No entries match the selected filters"}
        </Typography>
      )}
    </Stack>
  )
}
