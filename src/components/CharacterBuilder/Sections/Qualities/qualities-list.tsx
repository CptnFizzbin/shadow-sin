import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useQualitiesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-qualities-build-points.ts"
import { QualitiesListItem } from "#/components/CharacterBuilder/Sections/Qualities/qualities-list-item.tsx"
import { QualitiesMaxNegativeBpBonus } from "#/components/CharacterBuilder/Sections/Qualities/qualities-utils.ts"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/quality-form-dialog.tsx"
import { useQualitiesStore } from "#/components/Qualities/use-qualities-store.ts"
import { Label } from "#/components/UI/text/label.tsx"
import type { QualityData } from "#/lib/system/quality-data.ts"

type DialogState =
  | { open: true, quality: QualityData }
  | { open: false, quality?: QualityData }

interface QualitiesListProps {
  type?: "positive" | "negative" | "all"
}

export const QualitiesList: FC<QualitiesListProps> = ({ type = "all" }) => {
  const qualitiesStore = useQualitiesStore()
  const qualities = useStore(qualitiesStore, (state) => state)
  const qualitiesBuildPoints = useQualitiesBuildPoints()

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

      {type === "negative" && qualitiesBuildPoints.negative < -QualitiesMaxNegativeBpBonus && (
        <Alert severity="warning" sx={{ py: 0 }}>
          Negative qualities exceed the {QualitiesMaxNegativeBpBonus} BP bonus limit.
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
                  key={quality.name}
                  quality={quality}
                  onClick={() => setEditDialogState({ open: true, quality })}
                  onRemove={() => qualitiesStore.remove(quality.name)}
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
            qualitiesStore.update(quality)
            closeDialog()
          }}
        />
      )}
    </>
  )
}
