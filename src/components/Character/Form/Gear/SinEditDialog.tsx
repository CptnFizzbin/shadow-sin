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
import type { FC } from "react"
import { useState } from "react"
import { SIN_MAX_RATING } from "#/components/Character/Form/Gear/UseGearFormGroup.ts"
import type { SinFormItem } from "#/components/Character/Form/UseCharacterForm.ts"

interface SinEditDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<SinFormItem, "id">) => void
  initialValues?: SinFormItem
  canAddRealSin: boolean
}

const RATING_OPTIONS = Array.from({ length: SIN_MAX_RATING }, (_, i) => i + 1)

export const SinEditDialog: FC<SinEditDialogProps> = ({
  open,
  onClose,
  onSave,
  initialValues,
  canAddRealSin,
}) => {
  const isEditMode = initialValues !== undefined

  const [sinName, setSinName] = useState(initialValues?.name ?? "")
  const [sinKind, setSinKind] = useState<"real" | "fake">(
    initialValues?.kind ?? "fake",
  )
  const [sinRating, setSinRating] = useState(initialValues?.rating ?? 1)

  const handleSave = () => {
    if (!sinName.trim()) return
    onSave({
      name: sinName.trim(),
      kind: sinKind,
      rating: sinKind === "fake" ? sinRating : 1,
    })
    onClose()
  }

  const handleClose = () => {
    setSinName(initialValues?.name ?? "")
    setSinKind(initialValues?.kind ?? "fake")
    setSinRating(initialValues?.rating ?? 1)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEditMode ? "Edit SIN" : "Add SIN"}</DialogTitle>

      <DialogContent>
        <Stack gap={2} sx={{ pt: 1 }}>
          <MuiTextField
            label="Name"
            value={sinName}
            onChange={(e) => setSinName(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={sinKind}
              onChange={(e) => setSinKind(e.target.value as "real" | "fake")}
            >
              <MenuItem value="fake">Fake SIN</MenuItem>
              <MenuItem value="real" disabled={!canAddRealSin}>
                Real SIN{!canAddRealSin ? " (already have one)" : ""}
              </MenuItem>
            </Select>
          </FormControl>

          {sinKind === "fake" && (
            <FormControl fullWidth size="small">
              <InputLabel>Rating</InputLabel>
              <Select
                label="Rating"
                value={sinRating}
                onChange={(e) => setSinRating(Number(e.target.value))}
              >
                {RATING_OPTIONS.map((ratingOption) => (
                  <MenuItem key={ratingOption} value={ratingOption}>
                    {ratingOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!sinName.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
