import { Divider } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { QualitiesList } from "#/components/characterBuilder/sections/qualities/qualitiesList.tsx"
import { QualityFormDialog } from "#/components/qualities/dialogs/qualityFormDialog.tsx"
import { useQualitiesStore } from "#/components/qualities/useQualitiesStore.ts"

export const QualitiesSection: FC = () => {
  const qualitiesStore = useQualitiesStore()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

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
        onClick={() => setAddDialogOpen(true)}
        size="small"
      >
        Add Quality
      </Button>

      <QualityFormDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={(quality) => {
          qualitiesStore.add(quality)
          setAddDialogOpen(false)
        }}
      />
    </Stack>
  )
}
