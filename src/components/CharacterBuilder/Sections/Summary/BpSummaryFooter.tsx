import { Button } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Collapse from "@mui/material/Collapse"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import { lightBlue } from "@mui/material/colors"
import type { FC } from "react"
import { useState } from "react"

import { useBuilderBuildPointsApi } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseBuildPointsApi.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"

export interface BpSummaryFooterProps {
  onExpandedChange?: (expanded: boolean) => void
}

export const BpSummaryFooter: FC<BpSummaryFooterProps> = ({
  onExpandedChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const summary = useBuilderBuildPointsApi()

  const handleExpandedChange = (expanded: boolean) => {
    setIsExpanded(expanded)
    onExpandedChange?.(expanded)
  }

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        event.stopPropagation()
        handleExpandedChange(false)
      }}
    >
      <AppBar
        position="sticky"
        color="default"
        sx={{ top: "auto", bottom: 0, zIndex: 10 }}
      >
        <Collapse in={isExpanded} unmountOnExit>
          <Stack gap={1}>
            <Table size="small">
              <TableBody>
                {summary.lineItems.map(({ label, spent, allowance }) => {
                  const isOver = spent > (allowance ?? Infinity)

                  return (
                    <TableRow key={label}>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={isOver ? "error" : "text.primary"}
                        >
                          {label}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {spent !== 0 && (
                          <BuildPoints value={spent} error={isOver} />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Stack>
        </Collapse>

        <Button onClick={() => handleExpandedChange(!isExpanded)}>
          <Stack direction="column" gap={1} flexGrow={1}>
            <Stack
              direction="row"
              gap={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <BuildPoints value={summary.spent} total={summary.total} />

              <Typography sx={{ color: lightBlue[700] }}>
                {summary.remaining >= 0
                  ? `${summary.remaining} remaining`
                  : `${Math.abs(summary.remaining)} over`}
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={getProgress(summary.spent, summary.total)}
              color={summary.isOverBudget ? "error" : "primary"}
              sx={{ height: 8 }}
            />
          </Stack>
        </Button>
      </AppBar>
    </ClickAwayListener>
  )
}
