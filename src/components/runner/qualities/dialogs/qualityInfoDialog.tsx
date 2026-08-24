import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { DetailDialog } from "#/components/ui/dialog/detailDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { QualityData } from "#/system/qualityData.ts"
import { bookOptions } from "#/system/sourceData.ts"

interface QualityInfoDialogProps extends ControlledDialogProps<void> {
  quality: QualityData
}

const QualityInfoDialog: FC<QualityInfoDialogProps> = ({ ctrl, quality }) => {
  const bpLabel = quality.type === "positive" ? "BP Cost" : "BP Bonus"

  const bookLabel = quality.source
    ? (bookOptions.find((option) => option.value === quality.source?.book)?.label ?? quality.source.book)
    : undefined

  return (
    <DetailDialog ctrl={ctrl} title={quality.name}>
      <Stack sx={{ gap: 1.5 }}>
        <Stack direction="row" sx={{ flexWrap: "wrap" }}>
          <Stack sx={{ minWidth: 80 }}>
            <Label label="Type" variant="outlined" />
            <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
              {quality.type}
            </Typography>
          </Stack>

          {quality.bpValue !== undefined && (
            <Stack sx={{ minWidth: 80 }}>
              <Label label={bpLabel} variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {quality.bpValue}
              </Typography>
            </Stack>
          )}

          {quality.rating !== undefined && (
            <Stack sx={{ minWidth: 80 }}>
              <Label label="Rating" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {quality.rating}
              </Typography>
            </Stack>
          )}

          {quality.source && (
            <Stack sx={{ minWidth: 80 }}>
              <Label label="Source" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {bookLabel} p.{quality.source.page}
              </Typography>
            </Stack>
          )}
        </Stack>

        {quality.description && (
          <Typography color="text.secondary">
            {quality.description}
          </Typography>
        )}
      </Stack>
    </DetailDialog>
  )
}

interface UseQualityInfoDialogProps {
  quality: QualityData
}

export const useQualityInfoDialog = () => useDialog<void, UseQualityInfoDialogProps>(
  (ctrl, props) => <QualityInfoDialog ctrl={ctrl} quality={props.quality} />,
)
