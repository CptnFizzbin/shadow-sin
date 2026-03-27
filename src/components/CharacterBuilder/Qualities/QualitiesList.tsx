import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { QualitiesListItem } from "#/components/CharacterBuilder/Qualities/QualitiesListItem.tsx"
import { MAX_NEGATIVE_QUALITY_BP, useBuilderQualitiesBuildPoints } from "#/components/CharacterBuilder/Qualities/QualitiesUtils.ts"
import { useBuilderQualitiesApi } from "#/components/CharacterBuilder/Qualities/UseQualitiesApi.ts"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import type { QualityData } from "#/lib/system/qualityData.ts"

type DialogState =
  | { open: true, quality: QualityData }
  | { open: false, quality?: QualityData }

interface QualitiesListProps {
  type?: "positive" | "negative" | "all"
}

export const QualitiesList: FC<QualitiesListProps> = ({ type = "all" }) => {
  const { qualities, updateQuality, removeQuality } = useBuilderQualitiesApi()
  const qualitiesBuildPoints = useBuilderQualitiesBuildPoints()

  const [editDialogState, setEditDialogState] = useState<DialogState>({
    open: false,
  })

  const closeDialog = () =>
    setEditDialogState((prev) => prev && { ...prev, open: false })
  const clearDialog = () =>
    setEditDialogState({ open: false, quality: undefined })

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

      <Stack direction="row" justifyContent="flex-end">
        <Typography color="secondary.main">
          {bpLabel}: {bpValue} BP
        </Typography>
      </Stack>

      {type === "negative" && qualitiesBuildPoints.negative < -MAX_NEGATIVE_QUALITY_BP && (
        <Alert severity="warning" sx={{ py: 0 }}>
          Negative qualities exceed the {MAX_NEGATIVE_QUALITY_BP} BP bonus limit.
        </Alert>
      )}

      {filteredQualities.length === 0
        ? (
            <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
              No {label} qualities added
            </Typography>
          )
        : (
            <Stack gap={0.5}>
              {filteredQualities.map((quality) => (
                <QualitiesListItem
                  key={quality.id}
                  quality={quality}
                  onClick={() => setEditDialogState({ open: true, quality })}
                  onRemove={() => removeQuality(quality)}
                />
              ))}
            </Stack>
          )}

      {editDialogState.quality && (
        <QualityFormDialog
          open={editDialogState.open}
          quality={editDialogState.quality}
          onClose={closeDialog}
          onClosed={clearDialog}
          onSave={(quality) => {
            updateQuality(quality)
            closeDialog()
          }}
        />
      )}
    </>
  )
}
