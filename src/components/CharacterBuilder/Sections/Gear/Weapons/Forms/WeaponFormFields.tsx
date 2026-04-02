import Stack from "@mui/material/Stack"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/CharacterBuilder/General/Form/AvailabilityFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/CharacterBuilder/General/Form/SourceFieldGroup.tsx"
import { FirearmFormFields } from "#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/FirearmFormFields.tsx"
import {
  weaponFieldMap,
  weaponFormOpts,
} from "#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/UseWeaponForm.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { WeaponType } from "#/lib/system/gear/weaponData.ts"

const weaponTypeOptions = [
  { label: "Melee", value: WeaponType.melee },
  { label: "Firearm", value: WeaponType.firearm },
  { label: "Thrown", value: WeaponType.thrown },
  { label: "Projectile", value: WeaponType.projectile },
  { label: "Exotic", value: WeaponType.exotic },
  { label: "Other", value: WeaponType.other },
]

const attributeOptions = [
  { label: "None", value: "" },
  ...Object.values(AttributeKey).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: key,
  })),
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

        <Stack direction="row" gap={1}>
          <group.AppField name="skill">
            {(field) => (
              <field.TextField label="Skill" size="small" sx={{ flex: 1 }} />
            )}
          </group.AppField>

          <group.AppField name="attribute">
            {(field) => (
              <field.SelectField
                label="Attribute"
                size="small"
                sx={{ flex: 1 }}
                options={attributeOptions}
              />
            )}
          </group.AppField>
        </Stack>

        {/* Weapon-type-specific fields */}
        <group.Subscribe selector={({ values }) => values.weaponType}>
          {(weaponType) => {
            if (weaponType === WeaponType.melee) {
              return (
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
                      sx={{ width: 120 }}
                      slotProps={{ htmlInput: { min: 0, step: 1 } }}
                    />
                  )}
                </group.AppField>
              )
            }

            if (
              weaponType === WeaponType.thrown
              || weaponType === WeaponType.projectile
            ) {
              return (
                <group.AppField
                  name="range"
                  validators={{
                    onChange: z
                      .number("Range is required")
                      .min(0, "Range must be 0 or more"),
                  }}
                >
                  {(field) => (
                    <field.NumberField
                      label="Range (m)"
                      size="small"
                      sx={{ width: 140 }}
                    />
                  )}
                </group.AppField>
              )
            }

            if (weaponType === WeaponType.firearm) {
              return <FirearmFormFields form={group} fields={weaponFieldMap} />
            }

            return null
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
