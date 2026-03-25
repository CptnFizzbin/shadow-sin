import { Divider } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { QualitiesList } from "#/components/CharacterBuilder/Qualities/QualitiesList.tsx"
import { useQualitiesFormGroup } from "#/components/CharacterBuilder/Qualities/UseQualitiesFormGroup.ts"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export const QualitiesSection: FC = () => {
  const { qualities, buildPoints, addQuality, updateQuality, removeQuality } =
    useQualitiesFormGroup()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<QualityData | null>(null)

  return (
    <>
      <Stack gap={0.5}>
        <QualitiesList
          label={"Positive"}
          positive={true}
          bpUsed={buildPoints.bpSpent}
          qualities={qualities.positive}
          onSelect={(quality) => {
            setSelectedEntry(quality)
            setIsEditDialogOpen(true)
          }}
        />

        <Divider sx={{ marginY: 1 }} />

        <QualitiesList
          label={"Negative"}
          positive={false}
          bpUsed={buildPoints.bpBonus}
          qualities={qualities.negative}
          onSelect={(quality) => {
            setSelectedEntry(quality)
            setIsEditDialogOpen(true)
          }}
        />

        <Divider sx={{ marginY: 1 }} />

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RiAddLine />}
          onClick={() => setIsAddDialogOpen(true)}
          size="small"
        >
          Add Quality
        </Button>
      </Stack>

      <QualityFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={(quality) => {
          addQuality(quality)
          setIsAddDialogOpen(false)
        }}
      />

      {selectedEntry !== null && (
        <QualityFormDialog
          quality={selectedEntry}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onClosed={() => setSelectedEntry(null)}
          onSave={(quality) => {
            updateQuality(quality)
            setIsEditDialogOpen(false)
          }}
          onDelete={() => removeQuality(selectedEntry)}
        />
      )}
    </>
  )
}
