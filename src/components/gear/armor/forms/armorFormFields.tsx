import FormControlLabel from "@mui/material/FormControlLabel"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { GameEffectsFieldGroup } from "#/components/gameEffects/gameEffectsFieldGroup.tsx"
import {
  armorFormOpts,
} from "#/components/gear/armor/forms/useArmorForm.tsx"
import { SourceFieldGroup } from "#/components/sources/sourceFieldGroup.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const ArmorFormFields = withFieldGroup({
  ...armorFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

        <Paper sx={{ padding: 1 }}>
          <Stack>
            <Label label="Armor Ratings" />

            <Stack direction="row" sx={{ gap: 1 }}>
              <group.AppField
                name="ballistic"
                validators={{
                  onChange: z
                    .number("Ballistic is required")
                    .int("Ballistic must be a whole number")
                    .min(0, "Ballistic must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Ballistic"
                    size="small"
                    sx={{ flex: 1 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>

              <group.AppField
                name="impact"
                validators={{
                  onChange: z
                    .number("Impact is required")
                    .int("Impact must be a whole number")
                    .min(0, "Impact must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Impact"
                    size="small"
                    sx={{ flex: 1 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>
            </Stack>
          </Stack>
        </Paper>

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

        <AvailabilityFieldGroup form={group} fields="availability" />
        <SourceFieldGroup form={group} fields={{ source: "source" }} />

        <group.AppField name="equipped">
          {(field) => (
            <FormControlLabel
              control={(
                <Switch
                  checked={field.state.value ?? false}
                  onChange={(event) => field.handleChange(event.target.checked)}
                />
              )}
              label="Equipped"
            />
          )}
        </group.AppField>

        <group.AppField
          name="quantity"
          validators={{
            onChange: z
              .number("Quantity is required")
              .int("Quantity must be a whole number")
              .min(1, "Quantity must be at least 1"),
          }}
        >
          {(field) => (
            <field.NumberField
              label="Quantity"
              size="small"
              sx={{ width: 120 }}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
          )}
        </group.AppField>

        <group.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description / Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        </group.AppField>

        <GameEffectsFieldGroup form={group} fields={{ effects: "effects" }} />
      </Stack>
    )
  },
})
