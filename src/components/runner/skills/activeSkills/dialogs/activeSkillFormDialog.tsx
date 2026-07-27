import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import MuiSelect from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"
import { z } from "zod"

import { ActiveSkillSelectInput } from "#/components/runner/skills/forms/activeSkillSelectInput.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"
import { SkillRatingMax } from "#/system/skills/skillUtils.ts"

const CUSTOM_SENTINEL = "__custom__"

function isCustomSpec(skillName: string, specialization: string): boolean {
  const info = skillList[skillName as SkillKey]
  const fixedSpecs = (info?.specializations ?? []).filter((s): s is string => typeof s === "string")
  return specialization !== "" && !fixedSpecs.includes(specialization)
}

interface ActiveSkillFormDialogProps extends ControlledDialogProps<ActiveSkillData> {
  skill?: ActiveSkillData
  /** Skill names that must be disabled because they are already taken (individually or via a group). */
  disabledSkills?: ReadonlySet<string>
  onDelete?: () => void
}

type ActiveSkillFormData = {
  name: SkillKey | ""
  rating: string // Stored as string to match SelectField's contract; converted to number on submit
  specialization: string
}

export const ActiveSkillFormDialog: FC<ActiveSkillFormDialogProps> = ({
  ctrl,
  skill,
  disabledSkills,
  onDelete,
}) => {
  const isEditMode = !!skill

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
    } satisfies ActiveSkillFormData,
    onSubmit: ({ value }) => {
      ctrl.close({
        name: value.name as SkillKey,
        rating: Number(value.rating),
        specialization: value.specialization || undefined,
      })
    },
  })

  // Reactively subscribe to the selected skill name so the specialization section updates
  const selectedSkillName = useSelector(form.baseStore, (state) => state.values.name)

  const selectedSkillInfo = selectedSkillName ? skillList[selectedSkillName as SkillKey] : undefined
  const linkedAttr = selectedSkillInfo?.attr
  const allSpecs = selectedSkillInfo?.specializations ?? []
  const fixedSpecs = allSpecs.filter((s): s is string => typeof s === "string")
  const customEntries = allSpecs.filter(
    (s): s is { custom: true, placeholder: string } => typeof s === "object" && s !== null,
  )
  const hasFixed = fixedSpecs.length > 0
  const hasCustom = customEntries.length > 0

  return (
    <ControlledDialog
      ctrl={ctrl}
      maxWidth="sm"
      onClose={false}
      onClosed={() => {
        form.reset()
        setCustomModeActive(
          !!skill?.name && !!skill?.specialization && isCustomSpec(skill.name, skill.specialization),
        )
      }}
    >
      <Dialog.Title>{isEditMode ? "Edit Active Skill" : "Add Active Skill"}</Dialog.Title>

      <Dialog.Content>
        <form.AppForm>
          <Stack sx={{ gap: 2, pt: 1 }}>

            <form.AppField
              name="name"
              validators={{ onChange: z.enum(SkillKey) }}
              listeners={{
                onChange: () => {
                  form.setFieldValue("specialization", "")
                  setCustomModeActive(false)
                },
              }}
            >
              {(field) => (
                <ActiveSkillSelectInput
                  label="Skill"
                  size="small"
                  value={field.state.value ?? ""}
                  filterOption={(key) => !disabledSkills?.has(key)}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => field.handleBlur()}
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
                <field.CounterField
                  label="Rating"
                  min={1}
                  max={SkillRatingMax}
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
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box>
            {onDelete && (
              <Button
                color="error"
                onClick={() => {
                  onDelete()
                  ctrl.close()
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button color="secondary" onClick={() => ctrl.close()}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={() => form.handleSubmit()}>
              Save
            </Button>
          </Box>
        </Stack>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseActiveSkillDialogProps = Omit<
  ActiveSkillFormDialogProps,
  keyof ControlledDialogProps<ActiveSkillData>
>

export const useActiveSkillDialog = () => useDialog<ActiveSkillData, UseActiveSkillDialogProps | undefined>(
  (ctrl, props) => (
    <ActiveSkillFormDialog
      ctrl={ctrl}
      skill={props?.skill}
      disabledSkills={props?.disabledSkills}
      onDelete={props?.onDelete}
    />
  ),
)
