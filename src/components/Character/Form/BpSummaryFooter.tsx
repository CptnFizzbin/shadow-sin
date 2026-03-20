import { Button } from "@mui/material"
import Alert from "@mui/material/Alert"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Collapse from "@mui/material/Collapse"
import Divider from "@mui/material/Divider"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import { RiErrorWarningLine } from "@remixicon/react"
import { type FC, useState } from "react"
import { useBuildPointsSummary } from "#/components/Character/Form/UseBuildPointsSummary.ts"
import { getProgress } from "#/lib/ProgressUtils.ts"

export interface BpSummaryFooterProps {
  onExpandedChange?: (expanded: boolean) => void
}

export const BpSummaryFooter: FC<BpSummaryFooterProps> = ({
  onExpandedChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const summary = useBuildPointsSummary()

  const handleExpandedChange = (expanded: boolean) => {
    setIsExpanded(expanded)
    onExpandedChange?.(expanded)
  }

  const progressColor = summary.isOverBudget
    ? "error"
    : summary.warnings.length > 0
      ? "warning"
      : "primary"

  const warningIconColor = summary.isOverBudget ? "error.main" : "warning.main"

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
        elevation={4}
        sx={{ top: "auto", bottom: 0, zIndex: 10 }}
      >
        <Collapse in={isExpanded} unmountOnExit>
          <Stack gap={1} sx={{ px: 2, pt: 2, pb: 1 }}>
            <Table size="small">
              <TableBody>
                {summary.lineItems.map((lineItem) => (
                  <TableRow key={lineItem.label}>
                    <TableCell sx={{ pl: 0, borderBottom: "none" }}>
                      <Typography
                        variant="body2"
                        color={lineItem.isOver ? "error" : "text.primary"}
                      >
                        {lineItem.label}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ borderBottom: "none", pr: 0 }}
                    >
                      <Typography
                        variant="body2"
                        color={lineItem.isOver ? "error" : "text.secondary"}
                      >
                        {lineItem.spent}
                        {lineItem.allowance !== undefined
                          ? ` / ${lineItem.allowance}`
                          : ""}{" "}
                        BP
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {summary.warnings.length > 0 && (
              <>
                <Divider />
                <Stack gap={0.5} sx={{ pb: 1 }}>
                  {summary.warnings.map((warning) => (
                    <Alert
                      key={warning}
                      severity={summary.isOverBudget ? "error" : "warning"}
                      sx={{ py: 0 }}
                    >
                      {warning}
                    </Alert>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        </Collapse>

        <Button onClick={() => handleExpandedChange(!isExpanded)}>
          <Stack direction={"column"} gap={1} flexGrow={1}>
            <Stack
              direction="row"
              gap={1}
              justifyContent={"space-between"}
              alignItems="center"
            >
              {summary.warnings.length > 0 && (
                <Box sx={{ color: warningIconColor, display: "flex" }}>
                  <RiErrorWarningLine size={16} aria-hidden />
                </Box>
              )}

              <Typography color="secondary.main">
                {summary.spent} / {summary.total} BP
              </Typography>

              <Typography color="secondary.main">
                {summary.remaining >= 0
                  ? `${summary.remaining} remaining`
                  : `${Math.abs(summary.remaining)} over`}
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={getProgress(summary.spent, summary.total)}
              color={progressColor}
              sx={{ height: 8 }}
            />
          </Stack>
        </Button>
      </AppBar>
    </ClickAwayListener>
  )
}
