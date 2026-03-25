import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { QualityRow } from "#/components/Qualities/List/QualityRow.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

interface QualitiesListProps {
  label: string
  positive: boolean
  bpUsed: number
  qualities: QualityData[]
  onSelect: (quality: QualityData) => void
}

export const QualitiesList: FC<QualitiesListProps> = ({
  label,
  positive,
  bpUsed,
  qualities,
  onSelect,
}) => {
  return (
    <>
      <Label label={label} variant={"outlined"} />

      <Stack direction={"row"} justifyContent={"flex-end"}>
        <Typography color={"secondary.main"}>
          {positive ? "Cost" : "Bonus"}: {bpUsed} BP
        </Typography>
      </Stack>

      {qualities.length === 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No {label} qualities added
        </Typography>
      ) : (
        <Stack gap={0.5}>
          {qualities.map((quality) => (
            <QualityRow
              key={quality.id}
              quality={quality}
              onClick={() => onSelect(quality)}
            />
          ))}
        </Stack>
      )}
    </>
  )
}
