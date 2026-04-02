import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { z } from "zod"

import { AvailabilityFieldGroup } from '#/components/Availablity/availability-field-group.tsx"
import { FirearmFormFields } from '#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/firearm-form-fields.tsx"
import {
  weaponFieldMap,
  weaponFormOpts,
} from '#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/use-weapon-form.tsx"
import {
  WeaponDamageFormFields,
} from '#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/weapon-damage-form-fields.tsx"
import {
  WeaponSkillFormFields,
} from '#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/weapon-skill-form-fields.tsx"
import { SourceFieldGroup } from '#/components/Sources/source-field-group.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import { WeaponType } from "#/lib/system/gear/weaponData.ts"

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
      <Stack gap={1}>
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

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

        <group.AppField
          name="cost"
          validators={{
            onChange: z.number("Cost is required").min(0, "Cost must be 0 or more"),
          }}
        >
          {(field) => (
            <field.NumberField label="Cost (¥)" fullWidth size="small" />
          )}
        </group.AppField>

        <AvailabilityFieldGroup form={group} fields="availability" />
        <SourceFieldGroup form={group} fields={{ source: "source" }} />

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
      </Stack>
    )
  },
})
