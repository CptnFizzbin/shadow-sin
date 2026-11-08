import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import { sort } from "fast-sort"
import type { FC } from "react"

import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

const formatSignedAmount = (amount: number) => (amount > 0 ? `+${amount}` : `${amount}`)

const amountColor = (amount: number) => {
  if (amount > 0) return "success.main"
  if (amount < 0) return "error.main"
  return "text.secondary"
}

/** Read-only table of every entry in the Runner's karma ledger, newest first. */
export const KarmaLedgerList: FC = () => {
  const ledger = useRunnerSelector(KarmaSelectors.selectLog)

  // Newest first by when the entry was written, not array order.
  const sortedLedger = sort([...ledger]).desc((entry) => new Date(entry.timestamp).getTime())

  if (sortedLedger.length === 0) {
    return (
      <Typography color="textSecondary" sx={{ textAlign: "center" }}>
        No karma changes recorded yet
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "action.hover" }}>
            <TableCell align="right">Karma</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedLedger.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold", color: amountColor(entry.amount) }}>
                  {formatSignedAmount(entry.amount)}
                </Typography>
              </TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell sx={{ fontSize: "0.875rem", color: "text.secondary", whiteSpace: "nowrap" }}>
                {new Date(entry.timestamp).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
