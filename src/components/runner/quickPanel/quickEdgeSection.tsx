import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiFireLine, RiLoopLeftLine, RiSubtractLine } from "@remixicon/react"
import type { FC } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { EdgeSelectors } from "#/stores/runner/edge/edgeSlice.selectors.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const QuickEdgeSection: FC = () => {
  const confirmDialog = useConfirmDialog()
  const dispatch = useRunnerStoreDispatch()

  const max = useRunnerSelector(EdgeSelectors.selectMax)
  const current = useRunnerSelector(EdgeSelectors.selectCurrent)

  const onBurnClick = async () => {
    if (
      await confirmDialog.confirm({
        title: "Burn a point of Edge?",
        body: (
          <Typography>
            This will{" "}
            <Typography component="span" color="error">
              permanently
            </Typography>{" "}
            reduce your edge by 1. You'll need to spend karma to restore it.
          </Typography>
        ),
        slotProps: {
          confirmButton: { label: "BURN IT" },
        },
      })
    ) {
      dispatch(Actions.edge.burnEdge())
    }
  }

  const toggleCell = (cellValue: number) => {
    if (cellValue === current) {
      dispatch(Actions.edge.setCurrentEdge(cellValue - 1))
    } else {
      dispatch(Actions.edge.setCurrentEdge(cellValue))
    }
  }

  return (
    <Stack>
      <Label label="Edge" />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${max}, 1fr)`,
          gap: 0.5,
        }}
      >
        {Array.from({ length: max }, (_, index) => index + 1).map((cellValue, index) => (
          <Button
            key={cellValue}
            variant={cellValue <= current ? "contained" : "outlined"}
            onClick={(event) => {
              toggleCell(cellValue)
              event.currentTarget.blur()
            }}
            sx={{ minWidth: 0, px: 0 }}
          >
            {index + 1}
          </Button>
        ))}
      </Box>

      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
        <Tooltip title="Burn Edge (permanently reduces max)">
          <span>
            <IconButton color="error" disabled={max <= 1} onClick={onBurnClick} aria-label="Burn edge">
              <RiFireLine />
            </IconButton>
          </span>
        </Tooltip>

        <ButtonGroup sx={{ flex: 1 }}>
          <Button
            color="warning"
            disabled={current <= 0}
            onClick={() => dispatch(Actions.edge.setCurrentEdge(current - 1))}
            startIcon={<RiSubtractLine />}
            fullWidth
          >
            Spend 1
          </Button>
          <Button
            color="warning"
            disabled={current >= max}
            onClick={() => dispatch(Actions.edge.setCurrentEdge(current + 1))}
            endIcon={<RiAddLine />}
            fullWidth
          >
            Regain 1
          </Button>
        </ButtonGroup>

        <Tooltip title="Restore edge to maximum">
          <span>
            <IconButton
              color="warning"
              disabled={current >= max}
              onClick={() => dispatch(Actions.edge.restoreAllEdge())}
              aria-label="Restore edge to maximum"
            >
              <RiLoopLeftLine />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {confirmDialog.outlet}
    </Stack>
  )
}
