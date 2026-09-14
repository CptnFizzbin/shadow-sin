import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"
import { Icons } from "#/lib/icons.ts"
import { CheckFormulas } from "#/system/checks/checkFormulas.ts"
import type { ExtendedTestEntry } from "#/system/extendedTestData.ts"
import { isExtendedTestComplete } from "#/system/extendedTestData.ts"
import { DurationUtils } from "#/utils/duration/durationUtils.ts"

interface ExtendedTestCardProps {
  test: ExtendedTestEntry
  onEdit: () => void
  onRemove: () => void
  onHitsChange: (hits: number) => void
  onAttemptsChange: (attempts: number) => void
}

export const ExtendedTestCard: FC<ExtendedTestCardProps> = ({
  test,
  onEdit,
  onRemove,
  onHitsChange,
  onAttemptsChange,
}) => {
  const complete = isExtendedTestComplete(test)

  return (
    <Paper sx={{ padding: 1 }}>
      <Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ flexGrow: 1 }}>
            {test.description}
          </Typography>

          <Chip label={`Progress: ${test.currentHits} / ${test.hitsThreshold}`} size="small" variant="outlined" />
          <Chip label={`Interval: ${DurationUtils.format(test.interval ?? {})}`} size="small" variant="outlined" />

          <Stack direction="row" sx={{ gap: 0 }}>
            <IconButton size="small" aria-label="Edit Extended Test" onClick={onEdit}>
              <Icons.Edit size={18} />
            </IconButton>

            <IconButton size="small" aria-label="Remove Extended Test" onClick={onRemove}>
              <Icons.Delete size={18} />
            </IconButton>
          </Stack>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={Math.min(100, (test.currentHits / test.hitsThreshold) * 100)}
          color={complete ? "success" : "primary"}
        />

        <Stack direction="row" sx={{ gap: 1, paddingTop: 1 }}>
          <CounterInput
            label="Attempts"
            value={test.attempts}
            onChange={(attempts) => onAttemptsChange(attempts ?? 0)}
            min={0}
            size="small"
            fullWidth
          />

          <CounterInput
            label="Hits"
            value={test.currentHits}
            onChange={(hits) => onHitsChange(hits ?? 0)}
            min={0}
            size="small"
            fullWidth
          />

          <TextField
            label="Time Spent"
            size="small"
            value={
              DurationUtils.format(CheckFormulas.getDuration({ ...test, simplify: true }))
              || "Not Started"
            }
            fullWidth
            slotProps={{
              input: { readOnly: true },
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  )
}
