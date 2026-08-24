import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { z } from "zod"

import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { weaponFieldMap, weaponFormOpts } from "#/lib/hooks/items/types/weapons/forms/useWeaponForm.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { MeleeWeaponType, WeaponType } from "#/system/gear/weaponData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { FirearmFormFields } from "./firearmFormFields.tsx"
import { WeaponDamageFormFields } from "./weaponDamageFormFields.tsx"
import { WeaponSkillFormFields } from "./weaponSkillFormFields.tsx"

const weaponTypeOptions = [
  { label: "Melee", value: WeaponType.melee },
  { label: "Firearm", value: WeaponType.firearm },
  { label: "Thrown", value: WeaponType.thrown },
  { label: "Projectile", value: WeaponType.projectile },
  { label: "Exotic", value: WeaponType.exotic },
  { label: "Other", value: WeaponType.other },
]

const meleeTypeOptions = [
  { label: "Blade", value: MeleeWeaponType.blade },
  { label: "Club", value: MeleeWeaponType.club },
]

const meleeSkillByType: Record<MeleeWeaponType, SkillKey> = {
  [MeleeWeaponType.blade]: SkillKey.blades,
  [MeleeWeaponType.club]: SkillKey.clubs,
}
export const WeaponFormFields = withFieldGroup({
  ...weaponFormOpts,
  render: ({ group }) => {
    return (
      <Stack>
        <group.AppField
          name="weaponType"
          listeners={{
            onChange: ({ value }) => {
              if (value === WeaponType.melee) {
                group.setFieldValue("attribute", AttributeKey.strength)
              } else {
                group.setFieldValue("attribute", "")
              }
            },
          }}
        >
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

                      <group.AppField
                        name="meleeType"
                        listeners={{
                          onChange: ({ value }) => {
                            if (value) {
                              group.setFieldValue("skill", meleeSkillByType[value])
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <field.SelectField
                            label="Melee Weapon Type"
                            size="small"
                            fullWidth
                            options={meleeTypeOptions}
                          />
                        )}
                      </group.AppField>

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
                          <field.CounterField label="Reach" min={0} max={4} />
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
