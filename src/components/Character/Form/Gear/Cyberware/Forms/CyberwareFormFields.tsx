import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { z } from "zod"

import type { GearItemRestriction } from "#/components/Character/Form/Gear/Generic/Forms/UseGearItemForm.tsx"
import { gearItemFormOpts } from "#/components/Character/Form/Gear/Generic/Forms/UseGearItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

export const CyberwareFormFields = withFieldGroup({
  ...gearItemFormOpts,
  render: ({ group }) => {
    return (
      <Stack gap={1}>
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

        <group.AppField
          name="cost"
          validators={{
            onChange: z
              .number("Cost is required")
              .min(0, "Cost must be 0 or more"),
          }}
        >
          {(field) => (
            <field.NumberField label="Cost (¥)" fullWidth size="small" />
          )}
        </group.AppField>

        <Stack direction="row" gap={1}>
          <group.AppField name="availabilityRating">
            {(field) => (
              <field.NumberField
                label="Availability"
                size="small"
                sx={{ flex: 1 }}
              />
            )}
          </group.AppField>

          <group.AppField name="restriction">
            {(field) => (
              <ToggleButtonGroup
                value={field.state.value}
                exclusive
                onChange={(_, value: GearItemRestriction | null) => {
                  if (value !== null) field.handleChange(value)
                }}
                size="small"
                sx={{ height: 40, alignSelf: "center" }}
              >
                <ToggleButton value="none" sx={{ px: 1.5 }}>
                  —
                </ToggleButton>
                <ToggleButton value="restricted" sx={{ px: 1.5 }}>
                  R
                </ToggleButton>
                <ToggleButton value="forbidden" sx={{ px: 1.5 }}>
                  F
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </group.AppField>
        </Stack>

        <Stack direction="row" gap={1}>
          <group.AppField name="sourceBook">
            {(field) => (
              <field.TextField label="Book" size="small" sx={{ flex: 1 }} />
            )}
          </group.AppField>

          <group.AppField name="sourcePage">
            {(field) => (
              <field.NumberField label="Page" size="small" sx={{ width: 90 }} />
            )}
          </group.AppField>
        </Stack>

        <group.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
