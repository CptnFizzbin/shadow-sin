import ButtonBase from "@mui/material/ButtonBase"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { QualityData } from "#/system/qualityData.ts"

import { useQualityInfoDialog } from "./dialogs/qualityInfoDialog.tsx"

interface QualityViewerRowProps {
  quality: QualityData
  onClick: () => void
}

const QualityViewerRow: FC<QualityViewerRowProps> = ({ quality, onClick }) => {
  const { rating } = quality
  return (
    <ButtonBase
      component={Paper}
      onClick={onClick}
      aria-label={`View ${quality.name}`}
      sx={{
        "paddingX": 1,
        "paddingY": 0.5,
        "width": "100%",
        "textAlign": "left",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Typography>
        {quality.name}
        {rating !== undefined && ` (Rating ${rating})`}
      </Typography>
    </ButtonBase>
  )
}

export const QualitiesViewerSection: FC = () => {
  const qualities = useRunnerStoreSelector((sheet) => sheet.qualities)
  const qualityInfoDialog = useQualityInfoDialog()

  const positiveQualities = qualities.filter((q) => q.type === "positive")
  const negativeQualities = qualities.filter((q) => q.type === "negative")

  if (qualities.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ pl: 1 }}>
        No qualities added
      </Typography>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {positiveQualities.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Positive Qualities" variant="outlined" />
          {positiveQualities.map((quality) => (
            <QualityViewerRow
              key={quality.id}
              quality={quality}
              onClick={() => qualityInfoDialog.open({ quality })}
            />
          ))}
        </Stack>
      )}

      {negativeQualities.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Negative Qualities" variant="outlined" />
          {negativeQualities.map((quality) => (
            <QualityViewerRow
              key={quality.id}
              quality={quality}
              onClick={() => qualityInfoDialog.open({ quality })}
            />
          ))}
        </Stack>
      )}

      {qualityInfoDialog.dialog}
    </Stack>
  )
}
