import ButtonBase from "@mui/material/ButtonBase"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import type { QualityData } from "#/lib/system/types/qualityData.ts"

export interface QualityRowProps {
  quality: QualityData
  onClick: () => void
  onRemove?: () => void
}

export const QualitiesListItem: FC<QualityRowProps> = ({
  quality,
  onClick,
  onRemove,
}) => {
  const { bpValue = 0 } = quality
  const bpLabel = bpValue >= 1 ? `${quality.bpValue} BP` : "FREE"

  return (
    <Paper
      component={ButtonBase}
      onClick={onClick}
      elevation={1}
      aria-label={`Open quality ${quality.name}`}
      sx={{
        display: "flex",
        width: "100%",
        textAlign: "left",
        borderRadius: 1,
        px: 1,
        py: 0.5,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" alignItems="center" width="100%">
        <Typography flexGrow={1}>{quality.name}</Typography>
        <Typography variant="caption" color="secondary.main">
          {bpLabel}
        </Typography>
        {onRemove && (
          <IconButton
            color={"error"}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            aria-label={`Remove quality ${quality.name}`}
          >
            <RiDeleteBin6Line size={16} />
          </IconButton>
        )}
      </Stack>
    </Paper>
  )
}
