import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { parseISO } from "date-fns"
import { FC } from "react"

import { formatDate } from "../Helpers"
import { BalanceLog } from "../System/BalanceLog"

interface BalanceLogTableProps {
  log: BalanceLog

  formatValue?(value: number): string
}

export const BalanceLogTable: FC<BalanceLogTableProps> = ({
  log,
  formatValue = (value) => value,
}) => {
  let runningTotal = 0

  const logRows = log
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .map((entry) => (
      <TableRow key={entry.date}>
        <TableCell>{formatDate(entry.date)}</TableCell>
        <TableCell>{entry.note}</TableCell>
        <TableCell align="right">{formatValue(entry.value)}</TableCell>
        <TableCell align="right">
          {formatValue((runningTotal += entry.value))}
        </TableCell>
      </TableRow>
    ))

  logRows.reverse()

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Note</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{logRows}</TableBody>
      </Table>
    </Paper>
  )
}
