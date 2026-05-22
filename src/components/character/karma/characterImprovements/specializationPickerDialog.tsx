import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import MuiSelect from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"
import { useMemo, useState } from "react"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

const CUSTOM_SENTINEL = "__custom__"

interface SpecializationPickerDialogProps extends ControlledDialogProps<string> {
  /** The skill the specialization is for — drives the dropdown options. */
  skill: SkillKey
  /** Pre-fill the spec name (useful if reopening to edit). */
  initialValue?: string
}

const SpecializationPickerDialog: FC<SpecializationPickerDialogProps> = ({
  ctrl,
  skill,
  initialValue,
}) => {
  const skillInfo = skillList[skill]
  const { fixedSpecs, customEntries } = useMemo(() => {
    const all = skillInfo?.specializations ?? []
    return {
      fixedSpecs: all.filter((s): s is string => typeof s === "string"),
      customEntries: all.filter(
        (s): s is { custom: true, placeholder: string } => typeof s === "object" && s !== null,
      ),
    }
  }, [skillInfo])
  const hasFixed = fixedSpecs.length > 0
  const hasCustom = customEntries.length > 0
  const customOnly = !hasFixed && hasCustom

  const initialIsCustom = !!initialValue && !fixedSpecs.includes(initialValue)
  const [customMode, setCustomMode] = useState<boolean>(initialIsCustom || customOnly)
  const [value, setValue] = useState<string>(initialValue ?? "")

  const dropdownValue = customMode ? CUSTOM_SENTINEL : value
  const showCustomTextField = hasCustom && (customMode || customOnly)
  const canSave = value.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    ctrl.close(value.trim())
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm">
      <Dialog.Title>Specialization — {skill}</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1, minWidth: 320 }}>
          {hasFixed && (
            <FormControl fullWidth size="small">
              <InputLabel>Specialization</InputLabel>
              <MuiSelect
                value={dropdownValue}
                label="Specialization"
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
                {fixedSpecs.map((spec) => (
                  <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                ))}
                {hasCustom && (
                  <MenuItem value={CUSTOM_SENTINEL}>
                    <em>Custom…</em>
                  </MenuItem>
                )}
              </MuiSelect>
            </FormControl>
          )}

          {showCustomTextField && customEntries.map((entry, idx) => (
            <MuiTextField
              key={`${entry.placeholder}-${idx}`}
              label={hasFixed ? "Custom Specialization" : "Specialization"}
              placeholder={entry.placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="small"
              fullWidth
              autoFocus={customMode}
            />
          ))}

          {!hasFixed && !hasCustom && (
            <MuiTextField
              label="Specialization"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="small"
              fullWidth
              autoFocus
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
  skill: SkillKey
  initialValue?: string
}

export const useSpecializationPickerDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseSpecializationPickerDialogProps) => dialogApi.open<string>(
      (ctrl) => (
        <SpecializationPickerDialog
          ctrl={ctrl}
          skill={props.skill}
          initialValue={props.initialValue}
        />
      ),
    ),
  }
}
