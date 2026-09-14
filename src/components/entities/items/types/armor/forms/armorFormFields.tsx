import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import { Label } from "#/components/ui/text/label.tsx"
import { armorFormOpts } from "#/hooks/items/types/armor/useArmorForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const ArmorFormFields = withFieldGroup({
  ...armorFormOpts,
  render: ({ group }) => {
    return (
      <>
        <Label label="Armor Ratings" />

        <Stack direction="row">
          <group.AppField name="ballistic">
            {(field) => <field.CounterField label="Ballistic" min={0} max={20} fullWidth />}
          </group.AppField>

          <group.AppField name="impact">
            {(field) => <field.CounterField label="Impact" min={0} max={20} fullWidth />}
          </group.AppField>
        </Stack>

        <Label label="Armor Type" />

        <group.AppField name="isModifier">
          {(field) => (
            <ToggleButtonGroup
              exclusive
              size="small"
              value={field.state.value ? "modifier" : "base"}
              onChange={(_, value) => value && field.handleChange(value === "modifier")}
            >
              <ToggleButton value="base" sx={{ flexGrow: 1 }}>Base</ToggleButton>
              <ToggleButton value="modifier" sx={{ flexGrow: 1 }}>Modifier</ToggleButton>
            </ToggleButtonGroup>
          )}
        </group.AppField>
      </>
    )
  },
})
