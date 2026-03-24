import { Divider } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { QualitiesList } from "#/components/CharacterBuilder/Qualities/QualitiesList.tsx"
import { useQualitiesBuildSlice } from "#/components/CharacterBuilder/Qualities/QualitiesUtils.ts"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export const QualitiesSection: FC = () => {
  const qualities = useQualitiesBuildSlice()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const addQuality = (quality: QualityData) => {
    qualities.update((prev) => {
      return [...prev, { ...quality, id: crypto.randomUUID() }]
    })
  }

  return (
    <Stack gap={0.5}>
      <QualitiesList type="positive" />
      <Divider sx={{ marginY: 1 }} />
      <QualitiesList type="negative" />

      <Divider sx={{ marginY: 1 }} />

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<RiAddLine />}
        onClick={() => setAddDialogOpen(true)}
        size="small"
      >
        Add Quality
      </Button>

      <QualityFormDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={(quality) => {
          addQuality(quality)
          setAddDialogOpen(false)
        }}
      />
    </Stack>
  )
}
