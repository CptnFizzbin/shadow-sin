import Stack from "@mui/material/Stack"
import { z } from "zod"

import { weaponFormOpts } from "#/components/characterBuilder/sections/gear/weapons/forms/useWeaponForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const WeaponDamageFormFields = withFieldGroup({
  ...weaponFormOpts,
  render: ({ group }) => {
    return (
      <Stack direction="row" gap={1}>
        <group.AppField
          name="dmg"
          validators={{ onChange: z.string().min(1, "Damage is required") }}
        >
          {(field) => (
            <field.TextField label="Damage" size="small" sx={{ flex: 1 }} />
          )}
        </group.AppField>

        <group.AppField name="ap">
          {(field) => (
            <field.NumberField label="AP" size="small" sx={{ width: 80 }} />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
