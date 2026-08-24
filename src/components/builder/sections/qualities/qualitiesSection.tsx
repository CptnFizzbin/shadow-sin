import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useQualityFormDialog } from "#/components/runner/qualities/dialogs/qualityFormDialog.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"

import { QualitiesList } from "./qualitiesList.tsx"

export const QualitiesSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
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
        onClick={async () => {
          const quality = await qualityFormDialog.open()
          if (quality) dispatch(Actions.qualities.addQuality(quality))
        }}
        size="small"
      >
        Add Quality
      </Button>

      {qualityFormDialog.dialog}
    </Stack>
  )
}
