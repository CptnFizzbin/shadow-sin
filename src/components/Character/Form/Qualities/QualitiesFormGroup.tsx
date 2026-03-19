import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { type FC, useState } from "react"
import { useQualitiesFormGroup } from "#/components/Character/Form/Qualities/UseQualitiesFormGroup.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import { QualityRow } from "#/components/Qualities/List/QualityRow.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export const qualityBuildPoints = {
  allowance: {
    negative: 35,
    positive: 35,
  },
}

export interface QualitiesFormGroupProps {
  form: PlayerCharacterForm
}

export const QualitiesFormGroup: FC<QualitiesFormGroupProps> = ({ form }) => {
  const { qualities, buildPoints, addQuality, updateQuality, removeQuality } =
    useQualitiesFormGroup(form)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<QualityData | null>(null)

  return (
    <>
      <Stack gap={0.5}>
        <QualityGroup
          label={"Positive"}
          bpAllowance={qualityBuildPoints.allowance.positive}
          bpUsed={buildPoints.bpSpent}
          qualities={qualities.positive}
          onSelect={(quality) => {
            setSelectedEntry(quality)
            setIsEditDialogOpen(true)
          }}
        />

        <Divider sx={{ my: 1 }} />

        <QualityGroup
          label={"Negative"}
          bpAllowance={qualityBuildPoints.allowance.negative}
          bpUsed={buildPoints.bpBonus}
          qualities={qualities.negative}
          onSelect={(quality) => {
            setSelectedEntry(quality)
            setIsEditDialogOpen(true)
          }}
        />

        <Divider sx={{ my: 1 }} />

        <Button
          variant="outlined"
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
  bpAllowance: number
  bpUsed: number
  qualities: QualityData[]
  onSelect: (quality: QualityData) => void
}

const QualityGroup: FC<QualityGroupProps> = ({
  label,
  bpAllowance,
  bpUsed,
  qualities,
  onSelect,
}) => {
  const percentUsed = bpAllowance
    ? Math.min(100, Math.round((bpUsed / bpAllowance) * 100))
    : 0
  const isOver = bpUsed > bpAllowance

  return (
    <>
      <Box sx={{ mt: 0.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2">{label}</Typography>
          <Typography variant="caption">
            {bpUsed} / {bpAllowance}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percentUsed}
          sx={{ height: 8, borderRadius: 1, mt: 0.5, width: "100%" }}
        />
        {isOver && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {label} is limited to {bpAllowance} BP
          </Alert>
        )}
      </Box>

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
