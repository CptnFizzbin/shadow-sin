import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"
import { LICENSE_MAX_RATING } from "#/components/Character/Form/Gear/UseGearFormGroup.ts"
import type {
  LicenseFormItem,
  SinFormItem,
} from "#/components/Character/Form/UseCharacterForm.ts"

interface LicenseEditDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<LicenseFormItem, "id">) => void
  initialValues?: LicenseFormItem
  sins: SinFormItem[]
  defaultSinId?: string
}

const RATING_OPTIONS = Array.from(
  { length: LICENSE_MAX_RATING },
  (_, i) => i + 1,
)

export const LicenseEditDialog: FC<LicenseEditDialogProps> = ({
  open,
  onClose,
  onSave,
  initialValues,
  sins,
  defaultSinId,
}) => {
  const isEditMode = initialValues !== undefined

  const initialSinId = initialValues?.sinId ?? defaultSinId ?? sins[0]?.id ?? ""

  const [licenseName, setLicenseName] = useState(initialValues?.name ?? "")
  const [licenseRating, setLicenseRating] = useState(initialValues?.rating ?? 1)
  const [selectedSinId, setSelectedSinId] = useState(initialSinId)

  const selectedSin = sins.find((sin) => sin.id === selectedSinId)
  const isFakeSin = selectedSin?.kind === "fake"

  const handleSave = () => {
    if (!licenseName.trim() || !selectedSinId) return
    onSave({
      name: licenseName.trim(),
      rating: licenseRating,
      sinId: selectedSinId,
    })
    onClose()
  }

  const handleClose = () => {
    setLicenseName(initialValues?.name ?? "")
    setLicenseRating(initialValues?.rating ?? 1)
    setSelectedSinId(initialSinId)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEditMode ? "Edit License" : "Add License"}</DialogTitle>

      <DialogContent>
        <Stack gap={2} sx={{ pt: 1 }}>
          <MuiTextField
            label="License Name"
            value={licenseName}
            onChange={(e) => setLicenseName(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />

          <FormControl fullWidth size="small">
            <InputLabel>Attached SIN</InputLabel>
            <Select
              label="Attached SIN"
              value={selectedSinId}
              onChange={(e) => setSelectedSinId(e.target.value)}
            >
              {sins.map((sin) => (
                <MenuItem key={sin.id} value={sin.id}>
                  {sin.name} (
                  {sin.kind === "real" ? "Real" : `Fake R${sin.rating}`})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Rating</InputLabel>
            <Select
              label="Rating"
              value={licenseRating}
              onChange={(e) => setLicenseRating(Number(e.target.value))}
              disabled={!isFakeSin}
            >
              {RATING_OPTIONS.map((ratingOption) => (
                <MenuItem key={ratingOption} value={ratingOption}>
                  {ratingOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!isFakeSin && selectedSin && (
            <Typography variant="caption" color="text.secondary">
              Licenses on a real SIN are free and have no rating requirement.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!licenseName.trim() || !selectedSinId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
