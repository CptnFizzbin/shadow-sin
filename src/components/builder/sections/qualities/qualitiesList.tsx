import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useQualitiesBuildPoints } from "#/components/builder/buildPoints/hooks/useQualitiesBuildPoints.ts"
import { QualitiesListItem } from "#/components/builder/sections/qualities/qualitiesListItem.tsx"
import { QualitiesMaxNegativeBpBonus } from "#/components/builder/sections/qualities/qualitiesUtils.ts"
import { useQualityFormDialog } from "#/components/character/qualities/dialogs/qualityFormDialog.tsx"
import { selectAllQualities } from "#/components/character/qualities/qualitiesSelectors.ts"
import { useQualitiesStore } from "#/components/character/qualities/useQualitiesStore.ts"
import { Label } from "#/components/ui/text/label.tsx"

interface QualitiesListProps {
  type?: "positive" | "negative" | "all"
}

export const QualitiesList: FC<QualitiesListProps> = ({ type = "all" }) => {
  const qualitiesStore = useQualitiesStore()
  const qualities = useSelector(qualitiesStore, selectAllQualities)
  const qualitiesBuildPoints = useQualitiesBuildPoints()
  const qualityFormDialog = useQualityFormDialog()

  let label: string
  let bpLabel: string
  let bpValue: number
  switch (type) {
    case "positive":
      label = "Positive Qualities"
      bpLabel = "Cost"
      bpValue = qualitiesBuildPoints.positive
      break
    case "negative":
      label = "Negative Qualities"
      bpLabel = "Bonus"
      bpValue = qualitiesBuildPoints.negative
      break
    case "all":
    default:
      label = "Qualities"
      bpLabel = "Net"
      bpValue = qualitiesBuildPoints.spent
      break
  }

  const filteredQualities = qualities.filter(
    (q) => type === "all" || q.type === type,
  )

  return (
    <>
      <Label label={label} variant="outlined" />

      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <Typography color="secondary.main">
          {bpLabel}: {bpValue} BP
        </Typography>
      </Stack>

      {type === "negative" && qualitiesBuildPoints.negative < -QualitiesMaxNegativeBpBonus && (
        <Alert severity="warning" sx={{ py: 0 }}>
          Negative qualities exceed the {QualitiesMaxNegativeBpBonus} BP bonus limit.
        </Alert>
      )}

      {filteredQualities.length === 0
        ? (
            <Typography color="text.secondary" sx={{ pl: 1 }}>
              No {label} qualities added
            </Typography>
          )
        : (
            <Stack sx={{ gap: 0.5 }}>
              {filteredQualities.map((quality) => (
                <QualitiesListItem
                  key={quality.name}
                  quality={quality}
                  onClick={() => qualityFormDialog.open({
                    quality,
                    onSave: (updated) => qualitiesStore.update(updated),
                  })}
                  onRemove={() => qualitiesStore.remove(quality.name)}
                />
              ))}
            </Stack>
          )}
    </>
  )
}
