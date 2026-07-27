import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import MuiSelect from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"

const CUSTOM_SENTINEL = "__custom__"

interface SpecializationPickerDialogProps extends ControlledDialogProps<string> {
  /** Display label for the skill the specialization is for. */
  skillLabel: string
  /** Override the fieldLabel ("Specialization" by default) — e.g. "Lingo" for languages. */
  fieldLabel?: string
  /** Optional dropdown of preset specializations (e.g. SR4A book list for active skills). */
  fixedOptions?: readonly string[]
  /** Optional custom-input placeholders, shown when the user picks "Custom…" or there are no presets. */
  customPlaceholders?: readonly string[]
  /** Pre-fill the spec name (useful if reopening to edit). */
  initialValue?: string
}

const SpecializationPickerDialog: FC<SpecializationPickerDialogProps> = ({
  ctrl,
  skillLabel,
  fieldLabel = "Specialization",
  fixedOptions = [],
  customPlaceholders = [],
  initialValue,
}) => {
  const hasFixed = fixedOptions.length > 0
  const customOnly = !hasFixed

  const initialIsCustom = !!initialValue && !fixedOptions.includes(initialValue)
  const [customMode, setCustomMode] = useState<boolean>(initialIsCustom || customOnly)
  const [value, setValue] = useState<string>(initialValue ?? "")

  const dropdownValue = customMode ? CUSTOM_SENTINEL : value
  const showCustomTextField = customMode || customOnly
  const canSave = value.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    ctrl.close(value.trim())
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false}>
      <Dialog.Title>{fieldLabel} — {skillLabel}</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1, minWidth: 320 }}>
          {hasFixed && (
            <FormControl fullWidth size="small">
              <InputLabel>{fieldLabel}</InputLabel>
              <MuiSelect
                value={dropdownValue}
                label={fieldLabel}
                onChange={(e) => {
                  const next = e.target.value as string
                  if (next === CUSTOM_SENTINEL) {
                    setCustomMode(true)
                    setValue("")
                  } else {
                    setCustomMode(false)
                    setValue(next)
                  }
                }}
              >
                {fixedOptions.map((spec) => (
                  <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                ))}
                <MenuItem value={CUSTOM_SENTINEL}>
                  <em>Custom…</em>
                </MenuItem>
              </MuiSelect>
            </FormControl>
          )}

          {showCustomTextField && (
            <MuiTextField
              label={hasFixed ? `Custom ${fieldLabel}` : fieldLabel}
              placeholder={customPlaceholders[0]}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="small"
              fullWidth
              autoFocus={customMode || !hasFixed}
            />
          )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "flex-end", width: "100%" }}>
          <Box>
            <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={!canSave}
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseSpecializationPickerDialogProps {
  skillLabel: string
  fieldLabel?: string
  fixedOptions?: readonly string[]
  customPlaceholders?: readonly string[]
  initialValue?: string
}

export const useSpecializationPickerDialog = () => useDialog<string, UseSpecializationPickerDialogProps>(
  (ctrl, props) => (
    <SpecializationPickerDialog
      ctrl={ctrl}
      skillLabel={props.skillLabel}
      fieldLabel={props.fieldLabel}
      fixedOptions={props.fixedOptions}
      customPlaceholders={props.customPlaceholders}
      initialValue={props.initialValue}
    />
  ),
)
