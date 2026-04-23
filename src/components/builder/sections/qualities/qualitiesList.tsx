import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useQualitiesBuildPoints } from "#/components/builder/buildPoints/hooks/useQualitiesBuildPoints.ts"
import { QualitiesListItem } from "#/components/builder/sections/qualities/qualitiesListItem.tsx"
import { QualitiesMaxNegativeBpBonus } from "#/components/builder/sections/qualities/qualitiesUtils.ts"
import { QualityFormDialog } from "#/components/character/qualities/dialogs/qualityFormDialog.tsx"
import { selectAllQualities } from "#/components/character/qualities/qualitiesSelectors.ts"
import { useQualitiesStore } from "#/components/character/qualities/useQualitiesStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import type { QualityData } from "#/system/qualityData.ts"

type DialogState =
  | { open: true, quality: QualityData }
  | { open: false, quality?: QualityData }

interface QualitiesListProps {
  type?: "positive" | "negative" | "all"
}

export const QualitiesList: FC<QualitiesListProps> = ({ type = "all" }) => {
  const qualitiesStore = useQualitiesStore()
  const qualities = useStore(qualitiesStore, selectAllQualities)
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
