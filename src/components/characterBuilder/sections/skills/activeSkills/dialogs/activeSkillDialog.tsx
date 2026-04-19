import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import MuiSelect from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"
import { z } from "zod"

import { SkillRatingMax } from "#/components/characterBuilder/sections/skills/skillsBuilderUtils.ts"
import type { SelectOption } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { ActiveSkillData } from "#/lib/system/skills/activeSkillData"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"
import { skillList } from "#/lib/system/skills/skillList.ts"

const CUSTOM_SENTINEL = "__custom__"

function isCustomSpec(skillName: string, specialization: string): boolean {
  const info = skillList[skillName as SkillKey]
  const fixedSpecs = (info?.specializations ?? []).filter((s): s is string => typeof s === "string")
  return specialization !== "" && !fixedSpecs.includes(specialization)
}

interface ActiveSkillDialogProps {
  open: boolean
  skill?: ActiveSkillData
  /** Skill names that must be disabled because they are already taken (individually or via a group). */
  disabledSkills?: ReadonlySet<string>
  onSave: (skill: ActiveSkillData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const ratingSelectOptions: SelectOption[] = Array.from({ length: SkillRatingMax }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}))

export const ActiveSkillDialog: FC<ActiveSkillDialogProps> = ({
  open,
  skill,
  disabledSkills,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!skill
  const dialogKey = `${skill?.name ?? "new"}-${open ? "1" : "0"}`

  // UI-only state: tracks whether the user has activated the free-text custom input
  const [customModeActive, setCustomModeActive] = useState<boolean>(
    () => !!skill?.name && !!skill?.specialization && isCustomSpec(skill.name, skill.specialization),
  )

  const form = useAppForm({
    defaultValues: {
      name: skill?.name ?? "",
      // Stored as string to match SelectField's string value contract; converted to number on submit
      rating: String(skill?.rating ?? 1),
      specialization: skill?.specialization ?? "",
    },
    onSubmit: ({ value }) => {
      onSave({
        name: value.name as SkillKey,
        rating: Number(value.rating),
        specialization: value.specialization || undefined,
      })
      onClose()
    },
  })

  // Reactively subscribe to the selected skill name so the specialization section updates
  const selectedSkillName = useStore(form.baseStore, (state) => state.values.name)
  const selectedSkillInfo = selectedSkillName ? skillList[selectedSkillName as SkillKey] : undefined
  const linkedAttr = selectedSkillInfo?.attr
  const allSpecs = selectedSkillInfo?.specializations ?? []
  const fixedSpecs = allSpecs.filter((s): s is string => typeof s === "string")
  const customEntries = allSpecs.filter(
    (s): s is { custom: true, placeholder: string } => typeof s === "object" && s !== null,
  )
  const hasFixed = fixedSpecs.length > 0
  const hasCustom = customEntries.length > 0

  const skillSelectOptions: SelectOption[] = Object.values(SkillKey).sort().map((skillKey) => {
    const info = skillList[skillKey]
    return {
      value: skillKey,
      label: (
        <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 10 }}>
          <Typography>{skillKey}</Typography>
          <Typography color="text.secondary" sx={{ fontSize: "small" }}>{info?.group}</Typography>
        </Stack>
      ),
      disabled: disabledSkills?.has(skillKey) ?? false,
    }
  })

  return (
    <Dialog
      key={dialogKey}
      open={open}
      fullWidth
      maxWidth="sm"
      onTransitionExited={() => {
        form.reset()
        setCustomModeActive(
          !!skill?.name && !!skill?.specialization && isCustomSpec(skill.name, skill.specialization),
        )
        onClosed?.()
      }}
    >
      <DialogTitle>{isEditMode ? "Edit Active Skill" : "Add Active Skill"}</DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <form.AppForm>
          <Stack sx={{ gap: 2, pt: 1 }}>

            <form.AppField
              name="name"
              validators={{ onChange: z.string().min(1, "Skill is required") }}
              listeners={{
                onChange: () => {
                  form.setFieldValue("specialization", "")
                  setCustomModeActive(false)
                },
              }}
            >
              {(field) => (
                <field.SelectField
                  label="Skill"
                  options={skillSelectOptions}
                  size="small"
                />
              )}
            </form.AppField>

            {/* Linked attribute (read-only display) */}
            {linkedAttr && (
              <MuiTextField
                label="Linked Attribute"
                value={linkedAttr}
                size="small"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
            )}

            <form.AppField
              name="rating"
              validators={{ onChange: z.string().refine((v) => Number(v) >= 1 && Number(v) <= SkillRatingMax) }}
            >
              {(field) => (
                <field.SelectField
                  label="Rating"
                  options={ratingSelectOptions}
                  size="small"
                />
              )}
            </form.AppField>

            {/* Specialization — custom render due to dynamic dropdown + optional free-text input */}
            <form.AppField name="specialization">
              {(field) => {
                const dropdownValue = customModeActive ? CUSTOM_SENTINEL : field.state.value
                const showCustomTextField = hasCustom && (customModeActive || !hasFixed)

                return (
                  <>
                    {/* Dropdown for fixed specializations (hidden when custom-only) */}
                    {hasFixed && (
                      <FormControl fullWidth size="small">
                        <InputLabel>Specialization (optional)</InputLabel>
                        <MuiSelect
                          value={dropdownValue}
                          label="Specialization (optional)"
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const value = e.target.value as string
                            if (value === CUSTOM_SENTINEL) {
                              setCustomModeActive(true)
                              field.handleChange("")
                            } else {
                              setCustomModeActive(false)
                              field.handleChange(value)
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {fixedSpecs.map((spec) => (
                            <MenuItem key={spec} value={spec}>
                              {spec}
                            </MenuItem>
                          ))}
                          {hasCustom && (
                            <MenuItem value={CUSTOM_SENTINEL}>
                              <em>Custom...</em>
                            </MenuItem>
                          )}
                        </MuiSelect>
                      </FormControl>
                    )}

                    {/* Free-text input: shown for custom-only skills or after "Custom..." */}
                    {showCustomTextField && customEntries.length > 0 && (
                      <>
                        {customEntries.map((entry, idx) => (
                          <MuiTextField
                            key={`${entry.placeholder}-${idx}`}
                            label={hasFixed ? "Custom Specialization" : `Specialization (optional)`}
                            placeholder={entry.placeholder}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            size="small"
                            fullWidth
                            autoFocus={customModeActive && hasFixed && idx === 0}
                            sx={{ mt: idx === 0 ? 0 : 1 }}
                          />
                        ))}
                      </>
                    )}

                    {/* Disabled placeholder for skills with no specializations at all */}
                    {!hasFixed && !hasCustom && (
                      <FormControl fullWidth size="small" disabled>
                        <InputLabel>Specialization (optional)</InputLabel>
                        <MuiSelect value="" label="Specialization (optional)">
                          <MenuItem value="">
                            <em>None available</em>
                          </MenuItem>
                        </MuiSelect>
                      </FormControl>
                    )}
                  </>
                )
              }}
            </form.AppField>

          </Stack>
        </form.AppForm>
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
          <Button variant="contained" color="secondary" onClick={() => form.handleSubmit()}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
