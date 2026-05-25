import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/ui/dialog/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
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
    <ControlledDialog ctrl={ctrl} maxWidth="sm">
      <Dialog.Title>{quality.name}</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 1.5 }}>
          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
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
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Close</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseQualityInfoDialogProps {
  quality: QualityData
}

export const useQualityInfoDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseQualityInfoDialogProps) => dialogApi.open<void>(
      (ctrl) => <QualityInfoDialog ctrl={ctrl} quality={props.quality} />,
    ),
  }
}
