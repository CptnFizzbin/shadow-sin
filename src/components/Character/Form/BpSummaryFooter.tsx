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
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiErrorWarningLine,
} from "@remixicon/react"
import { type FC, useState } from "react"
import { useBuildPointsSummary } from "#/components/Character/Form/UseBuildPointsSummary.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export interface BpSummaryFooterProps {
  form: PlayerCharacterForm
}

export const BpSummaryFooter: FC<BpSummaryFooterProps> = ({ form }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const summary = useBuildPointsSummary(form)

  const progressPercent = Math.min(
    100,
    Math.round((summary.spent / summary.total) * 100),
  )

  const progressColor = summary.isOverBudget
    ? "error"
    : summary.warnings.length > 0
      ? "warning"
      : "primary"

  const warningIconColor = summary.isOverBudget ? "error.main" : "warning.main"

  return (
    <ClickAwayListener onClickAway={() => setIsExpanded(false)}>
      <AppBar
        position="fixed"
        color="default"
        elevation={4}
        sx={{ top: "auto", bottom: 0 }}
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

        <Toolbar
          component="button"
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse BP summary" : "Expand BP summary"}
          sx={{
            cursor: "pointer",
            gap: 1,
            minHeight: "48px !important",
            width: "100%",
            border: "none",
            background: "none",
            textAlign: "left",
          }}
        >
          <Stack direction="row" alignItems="center" gap={0.5} flexShrink={0}>
            {summary.warnings.length > 0 && (
              <Box sx={{ color: warningIconColor, display: "flex" }}>
                <RiErrorWarningLine size={16} aria-hidden />
              </Box>
            )}
            <Typography variant="body2" fontWeight="medium">
              {summary.spent} / {summary.total} BP
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progressPercent}
            color={progressColor}
            sx={{ flex: 1, height: 6, borderRadius: 1 }}
          />

          <Typography variant="caption" color="text.secondary" flexShrink={0}>
            {summary.remaining >= 0
              ? `${summary.remaining} remaining`
              : `${Math.abs(summary.remaining)} over`}
          </Typography>

          {isExpanded ? (
            <RiArrowDownSLine size={18} aria-hidden />
          ) : (
            <RiArrowUpSLine size={18} aria-hidden />
          )}
        </Toolbar>
      </AppBar>
    </ClickAwayListener>
  )
}
