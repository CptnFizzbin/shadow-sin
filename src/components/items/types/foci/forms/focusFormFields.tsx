import Stack from "@mui/material/Stack"

import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { FocusType } from "#/system/gear/focusData.ts"
import { SpellCategory } from "#/system/magic/spellData.ts"

import { focusFormOpts, getDefaultPowerFocusEffects } from "./useFocusForm.tsx"

const focusTypeOptions = [
  { label: "Power", value: FocusType.Power },
  { label: "Spellcasting", value: FocusType.Spellcasting },
  { label: "Summoning", value: FocusType.Summoning },
  { label: "Banishing", value: FocusType.Banishing },
  { label: "Centering", value: FocusType.Centering },
  { label: "Sustaining", value: FocusType.Sustaining },
  { label: "Weapon", value: FocusType.Weapon },
]

const spellCategoryOptions = [
  { label: "Combat", value: SpellCategory.Combat },
  { label: "Detection", value: SpellCategory.Detection },
  { label: "Health", value: SpellCategory.Health },
  { label: "Illusion", value: SpellCategory.Illusion },
  { label: "Manipulation", value: SpellCategory.Manipulation },
]

export const FocusFormFields = withFieldGroup({
  ...focusFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
        <Label label="Focus" />

        <group.AppField
          name="focusType"
          listeners={{
            onChange: ({ value }) => {
              if (value === FocusType.Power) {
                const currentEffects = group.state.values.effects ?? []
                if (currentEffects.length === 0) {
                  group.setFieldValue("effects", getDefaultPowerFocusEffects())
                }
              }
              if (value !== FocusType.Sustaining) {
                group.setFieldValue("spellCategory", undefined)
                group.setFieldValue("slottedSpellId", undefined)
              }
            },
          }}
        >
          {(field) => (
            <field.SelectField
              label="Focus Type"
              size="small"
              fullWidth
              options={focusTypeOptions}
            />
          )}
        </group.AppField>

        <group.AppField
          name="bonded"
          listeners={{
            onChange: ({ value }) => {
              if (!value) {
                group.setFieldValue("equipped", false)
              }
            },
          }}
        >
          {(field) => <field.SwitchField label="Bonded" />}
        </group.AppField>

        <group.Subscribe selector={({ values }) => values.focusType}>
          {(focusType) =>
            focusType === FocusType.Sustaining
              ? (
                  <group.AppField name="spellCategory">
                    {(field) => (
                      <field.SelectField
                        label="Spell Category"
                        size="small"
                        fullWidth
                        options={spellCategoryOptions}
                      />
                    )}
                  </group.AppField>
                )
              : null}
        </group.Subscribe>
      </Stack>
    )
  },
})
