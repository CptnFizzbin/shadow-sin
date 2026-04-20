import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { QualityData } from "#/system/qualityData.ts"

const QualityViewerRow: FC<{ quality: QualityData }> = ({ quality }) => {
  const { rating } = quality
  return (
    <Paper sx={{ paddingX: 1, paddingY: 0.5 }}>
      <Typography>
        {quality.name}
        {rating !== undefined && ` (Rating ${rating})`}
      </Typography>
    </Paper>
  )
}

export const QualitiesViewerSection: FC = () => {
  const qualities = useCharacterSheet((sheet) => sheet.qualities)

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
            <QualityViewerRow key={quality.name} quality={quality} />
          ))}
        </Stack>
      )}

      {negativeQualities.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Negative Qualities" variant="outlined" />
          {negativeQualities.map((quality) => (
            <QualityViewerRow key={quality.name} quality={quality} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
