import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { z } from "zod"

import { FirearmFormFields } from "#/components/gear/weapons/forms/firearmFormFields.tsx"
import {
  weaponFieldMap,
  weaponFormOpts,
} from "#/components/gear/weapons/forms/useWeaponForm.tsx"
import {
  WeaponDamageFormFields,
} from "#/components/gear/weapons/forms/weaponDamageFormFields.tsx"
import {
  WeaponSkillFormFields,
} from "#/components/gear/weapons/forms/weaponSkillFormFields.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"

const weaponTypeOptions = [
  { label: "Melee", value: WeaponType.melee },
  { label: "Firearm", value: WeaponType.firearm },
  { label: "Thrown", value: WeaponType.thrown },
  { label: "Projectile", value: WeaponType.projectile },
  { label: "Exotic", value: WeaponType.exotic },
  { label: "Other", value: WeaponType.other },
]
export const WeaponFormFields = withFieldGroup({
  ...weaponFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
        <group.AppField name="weaponType">
          {(field) => (
            <field.SelectField
              label="Weapon Type"
              size="small"
              fullWidth
              options={weaponTypeOptions}
            />
          )}
        </group.AppField>

        <group.Subscribe selector={({ values }) => values.weaponType}>
          {(weaponType) => {
            switch (weaponType) {
              case WeaponType.melee:
                return (
                  <Paper sx={{ padding: 1 }}>
                    <Stack>
                      <Label label="Melee Weapon Traits" />

                      <WeaponSkillFormFields form={group} fields={weaponFieldMap} />
                      <WeaponDamageFormFields form={group} fields={weaponFieldMap} />

                      <group.AppField
                        name="reach"
                        validators={{
                          onChange: z
                            .number("Reach is required")
                            .int("Reach must be a whole number")
                            .min(0, "Reach must be 0 or more"),
                        }}
                      >
                        {(field) => (
                          <field.NumberField
                            label="Reach"
                            size="small"
                            slotProps={{ htmlInput: { min: 0, step: 1 } }}
                          />
                        )}
                      </group.AppField>
                    </Stack>
                  </Paper>
                )
              case WeaponType.firearm:
                return (
                  <Paper sx={{ padding: 1 }}>
                    <Stack>
                      <Label label="Firearm Traits" />
                      <FirearmFormFields form={group} fields={weaponFieldMap} />
                    </Stack>
                  </Paper>
                )
              default:
                return (
                  <Paper sx={{ padding: 1 }}>
                    <Stack>
                      <Label label="Weapon Traits" />
                      <WeaponSkillFormFields form={group} fields={weaponFieldMap} />
                      <WeaponDamageFormFields form={group} fields={weaponFieldMap} />
                    </Stack>
                  </Paper>
                )
            }
          }}
        </group.Subscribe>
      </Stack>
    )
  },
})
