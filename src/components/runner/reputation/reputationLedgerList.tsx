import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { ReputationSelectors } from "#/stores/runner/reputation/reputationSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

const getStatLabel = (stat: string): string => {
  switch (stat) {
    case "streetCred":
      return "Street Cred"
    case "notoriety":
      return "Notoriety"
    case "publicAwarenessModifier":
      return "Public Awareness Modifier"
    default:
      return stat
  }
}

export const ReputationLedgerList: FC = () => {
  const ledger = useRunnerSelector(ReputationSelectors.selectLedger)

  if (ledger.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
        No reputation events recorded yet
      </Typography>
    )
  }

  // Reverse order: most recent first
  const sortedLedger = [...ledger].reverse()

  return (
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
          {sortedLedger.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{getStatLabel(entry.stat)}</TableCell>
              <TableCell align="right">
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: entry.amount > 0 ? "success.main" : "error.main",
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
