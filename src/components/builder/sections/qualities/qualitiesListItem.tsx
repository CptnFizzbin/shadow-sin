import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { EditorMode } from "#/stores/builder/editorMode.tsx"
import type { QualityData } from "#/system/qualityData.ts"

interface QualityRowProps {
  quality: QualityData
  onClick: () => void
  onRemove?: () => void
}

export const QualitiesListItem: FC<QualityRowProps> = ({
  quality,
  onClick,
  onRemove,
}) => {
  const { bpValue = 0, rating } = quality
  const bpLabel = bpValue >= 1 ? `${quality.bpValue} BP` : "FREE"

  return (
    <Paper
      onClick={onClick}
      sx={{
        "textAlign": "left",
        "cursor": "pointer",
        "paddingLeft": 1,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", width: "100%" }}>
        <Typography sx={{ flexGrow: 1 }}>
          {quality.name}
          {rating !== undefined && ` (Rating ${rating})`}
        </Typography>
        <EditorMode.IsBuilder>
          <Typography color="secondary.main">
            {bpLabel}
          </Typography>
        </EditorMode.IsBuilder>
        {onRemove && (
          <IconButton
            color="error"
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
