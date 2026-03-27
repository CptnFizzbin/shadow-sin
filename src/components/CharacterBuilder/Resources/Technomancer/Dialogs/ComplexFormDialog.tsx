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
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useId, useState } from "react"

import type { ComplexFormFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"

interface ComplexFormDialogProps {
  open: boolean
  form?: ComplexFormFormState
  maxRating: number
  onSave: (form: ComplexFormFormState) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const ComplexFormDialog: FC<ComplexFormDialogProps> = ({
  open,
  form,
  maxRating,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!form
  const ratingLabelId = useId()

  const [name, setName] = useState<string>(form?.name ?? "")
  const [rating, setRating] = useState<number>(form?.rating ?? 1)
  const [nameError, setNameError] = useState(false)

  const effectiveMaxRating = Math.max(maxRating, 1)
  const ratingOptions = Array.from(
    { length: effectiveMaxRating },
    (_, index) => index + 1,
  )

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    onSave({
      id: form?.id ?? crypto.randomUUID(),
      name: name.trim(),
      rating: Math.min(rating, effectiveMaxRating),
    })
  }

  const handleClosed = () => {
    setName(form?.name ?? "")
    setRating(form?.rating ?? 1)
    setNameError(false)
    onClosed?.()
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onTransitionExited={handleClosed}
    >
      <DialogTitle>
        {isEditMode
          ? "Edit Complex Form"
          : "Add Complex Form"}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack gap={2} sx={{ pt: 1 }}>
          <TextField
            label="Program Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(false)
            }}
            error={nameError}
            helperText={nameError ? "Program name is required" : undefined}
            size="small"
            fullWidth
            autoFocus
          />

          <FormControl fullWidth size="small">
            <InputLabel id={ratingLabelId}>Rating</InputLabel>
            <Select
              labelId={ratingLabelId}
              value={Math.min(rating, effectiveMaxRating)}
              label="Rating"
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {ratingOptions.map((ratingOption) => (
                <MenuItem key={ratingOption} value={ratingOption}>
                  {ratingOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <div>
          {onDelete && (
            <Button
              color="error"
              onClick={() => {
                onDelete()
                onClose()
              }}
            >
              Delete
            </Button>
          )}
        </div>
        <div>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
