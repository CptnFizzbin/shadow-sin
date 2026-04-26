import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { QualitiesList } from "#/components/builder/sections/qualities/qualitiesList.tsx"
import { useQualityFormDialog } from "#/components/character/qualities/dialogs/qualityFormDialog.tsx"
import { useQualitiesStore } from "#/components/character/qualities/useQualitiesStore.ts"

export const QualitiesSection: FC = () => {
  const qualitiesStore = useQualitiesStore()
  const qualityFormDialog = useQualityFormDialog()

  return (
    <Stack sx={{ gap: 0.5 }}>
      <QualitiesList type="positive" />
      <Divider sx={{ marginY: 1 }} />
      <QualitiesList type="negative" />

      <Divider sx={{ marginY: 1 }} />

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<RiAddLine />}
        onClick={() => qualityFormDialog.open({
          onSave: (quality) => qualitiesStore.add(quality),
        })}
        size="small"
      >
        Add Quality
      </Button>
    </Stack>
  )
}
