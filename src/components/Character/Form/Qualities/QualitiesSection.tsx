import { Divider } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useQualitiesFormGroup } from "#/components/Character/Form/Qualities/UseQualitiesFormGroup.ts"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import { QualityRow } from "#/components/Qualities/List/QualityRow.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export const qualityBuildPoints = {
  allowance: {
    negative: 35,
    positive: 35,
  },
}

export const QualitiesSection: FC = () => {
  const { qualities, buildPoints, addQuality, updateQuality, removeQuality } =
    useQualitiesFormGroup()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<QualityData | null>(null)

  return (
    <>
      <Stack gap={0.5}>
        <QualityGroup
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

        <QualityGroup
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

interface QualityGroupProps {
  label: string
  positive: boolean
  bpUsed: number
  qualities: QualityData[]
  onSelect: (quality: QualityData) => void
}

const QualityGroup: FC<QualityGroupProps> = ({
  label,
  positive,
  bpUsed,
  qualities,
  onSelect,
}) => {
  return (
    <>
      <Label label={label} variant={"outlined"} />

      <Stack direction={"row"} justifyContent={"flex-end"}>
        <Typography color={"secondary.main"}>
          {positive ? "Cost" : "Bonus"}: {bpUsed} BP
        </Typography>
      </Stack>

      {qualities.length === 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No {label} qualities added
        </Typography>
      ) : (
        <Stack gap={0.5}>
          {qualities.map((quality) => (
            <QualityRow
              key={quality.id}
              quality={quality}
              onClick={() => onSelect(quality)}
            />
          ))}
        </Stack>
      )}
    </>
  )
}
