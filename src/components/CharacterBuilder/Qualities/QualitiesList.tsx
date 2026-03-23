import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { QualitiesListItem } from "#/components/CharacterBuilder/Qualities/QualitiesListItem.tsx"
import {
  useQualitiesBuildPoints,
  useQualitiesBuildSlice,
} from "#/components/CharacterBuilder/Qualities/QualitiesUtils.ts"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

type DialogState =
  | { open: true; quality: QualityData }
  | { open: false; quality?: QualityData }

interface QualitiesListProps {
  type?: "positive" | "negative" | "all"
}

export const QualitiesList: FC<QualitiesListProps> = ({ type = "all" }) => {
  const qualitiesSlice = useQualitiesBuildSlice()
  const qualitiesBuildPoints = useQualitiesBuildPoints()

  const [editDialogState, setEditDialogState] = useState<DialogState>({
    open: false,
  })

  const closeDialog = () =>
    setEditDialogState((prev) => prev && { ...prev, open: false })
  const clearDialog = () =>
    setEditDialogState({ open: false, quality: undefined })

  const onUpdateQuality = (quality: QualityData) => {
    qualitiesSlice.update((prev) => {
      return prev.map((q) => (q.id === quality.id ? quality : q))
    })
  }

  const onRemoveQuality = (quality: QualityData) => {
    qualitiesSlice.update((prev) => {
      return prev.filter((q) => q.id !== quality.id)
    })
  }

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

  const qualities = qualitiesSlice.state.filter(
    (q) => type === "all" || q.type === type,
  )

  return (
    <>
      <Label label={label} variant={"outlined"} />

      <Stack direction={"row"} justifyContent={"flex-end"}>
        <Typography color={"secondary.main"}>
          {bpLabel}: {bpValue} BP
        </Typography>
      </Stack>

      {qualities.length === 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No {label} qualities added
        </Typography>
      ) : (
        <Stack gap={0.5}>
          {qualities.map((quality) => (
            <QualitiesListItem
              key={quality.id}
              quality={quality}
              onClick={() => setEditDialogState({ open: true, quality })}
              onRemove={() => onRemoveQuality(quality)}
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
            onUpdateQuality(quality)
            closeDialog()
          }}
        />
      )}
    </>
  )
}
