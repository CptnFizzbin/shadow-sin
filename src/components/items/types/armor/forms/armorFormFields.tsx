import Stack from "@mui/material/Stack"

import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

import { armorFormOpts } from "./useArmorForm.tsx"

export const ArmorFormFields = withFieldGroup({
  ...armorFormOpts,
  render: ({ group }) => {
    return (
      <>
        <Label label="Armor Ratings" />

        <Stack direction="row" sx={{ gap: 1 }}>
          <group.AppField name="ballistic">
            {(field) => <field.CounterField label="Ballistic" min={0} max={20} fullWidth />}
          </group.AppField>

          <group.AppField name="impact">
            {(field) => <field.CounterField label="Impact" min={0} max={20} fullWidth />}
          </group.AppField>
        </Stack>
      </>
    )
  },
})
