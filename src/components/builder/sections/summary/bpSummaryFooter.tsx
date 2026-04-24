import { Button } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import ButtonBase from "@mui/material/ButtonBase"
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

import { useBuilderBuildPointsApi } from "#/components/builder/buildPoints/hooks/useBuildPointsApi.ts"
import { builderSections } from "#/components/builder/sections/builderSectionId.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { getProgress } from "#/lib/progressUtils.ts"

interface BpSummaryFooterProps {
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

  const handleSectionClick = (sectionId: string | undefined) => {
    if (!sectionId) return

    const targetElement = document.getElementById(sectionId)
    if (!targetElement) {
      handleExpandedChange(false)
      return
    }

    targetElement.focus({ preventScroll: true })

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    })

    handleExpandedChange(false)
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
          <Stack sx={{ gap: 1 }}>
            <Table size="small">
              <TableBody>
                {summary.lineItems.map(({ sectionId, spent, allowance }) => {
                  const section = builderSections[sectionId]
                  const isOver = spent > (allowance ?? Infinity)

                  return (
                    <TableRow key={sectionId}>
                      <TableCell colSpan={2} sx={{ padding: 0 }}>
                        <ButtonBase
                          onClick={() => handleSectionClick(sectionId)}
                          disabled={!sectionId}
                          sx={{
                            "width": "100%",
                            "display": "flex",
                            "justifyContent": "space-between",
                            "alignItems": "center",
                            "px": 1,
                            "py": 0.5,
                            "&:hover": sectionId ? { backgroundColor: "action.hover" } : undefined,
                          }}
                        >
                          <Typography

                            color={isOver ? "error" : "text.primary"}
                          >
                            {section.label}
                          </Typography>
                          {spent !== 0 && (
                            <BuildPoints value={spent} error={isOver} />
                          )}
                        </ButtonBase>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Stack>
        </Collapse>

        <Button onClick={() => handleExpandedChange(!isExpanded)}>
          <Stack direction="column" sx={{ gap: 1, flexGrow: 1 }}>
            <Stack
              direction="row"
              sx={{ gap: 1, justifyContent: "space-between", alignItems: "center" }}
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
