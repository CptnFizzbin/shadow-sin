import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/CharacterBuilder/General/Form/AvailabilityFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/CharacterBuilder/General/Form/SourceFieldGroup.tsx"
import { weaponFormOpts } from "#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/UseWeaponForm.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { FirearmType, WeaponType } from "#/lib/system/gear/weaponData.ts"

const TOGGLE_LABEL_MIN_WIDTH = 100

const weaponTypeOptions = [
  { label: "Melee", value: WeaponType.melee },
  { label: "Firearm", value: WeaponType.firearm },
  { label: "Thrown", value: WeaponType.thrown },
  { label: "Projectile", value: WeaponType.projectile },
  { label: "Exotic", value: WeaponType.exotic },
  { label: "Other", value: WeaponType.other },
]

const firearmTypeOptions = Object.entries(FirearmType).map(([, value]) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}))

const attributeOptions = [
  { label: "None", value: "" },
  ...Object.values(AttributeKey).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: key,
  })),
]

const ammoTypeOptions = [
  { label: "Break-action", value: "break" },
  { label: "Clip", value: "clip" },
  { label: "Drum", value: "drum" },
  { label: "Muzzle-loader", value: "muzzle" },
  { label: "Magazine", value: "magazine" },
  { label: "Cylinder", value: "cylinder" },
  { label: "Belt", value: "belt" },
]

const firingModes = [
  { label: "SS", value: "SS" },
  { label: "B", value: "B" },
  { label: "FA", value: "FA" },
]

const attachmentSlots = [
  { label: "Top", value: "Top" },
  { label: "Barrel", value: "Barrel" },
  { label: "Under", value: "Under" },
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
              return (
                <Stack gap={1}>
                  <group.AppField name="firearmType">
                    {(field) => (
                      <field.SelectField
                        label="Firearm Type"
                        size="small"
                        fullWidth
                        options={firearmTypeOptions}
                      />
                    )}
                  </group.AppField>

                  <Stack direction="row" gap={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: TOGGLE_LABEL_MIN_WIDTH }}>
                      Firing Modes
                    </Typography>
                    <group.Subscribe selector={({ values }) => values.firemodes}>
                      {(firemodes) => {
                        const toggleMode = (mode: string) => {
                          const updatedModes = firemodes.includes(mode)
                            ? firemodes.filter((m) => m !== mode)
                            : [...firemodes, mode]
                          group.setFieldValue("firemodes", updatedModes)
                        }
                        return (
                          <ToggleButtonGroup size="small">
                            {firingModes.map(({ label, value }) => (
                              <ToggleButton
                                key={value}
                                value={value}
                                selected={firemodes.includes(value)}
                                onClick={() => toggleMode(value)}
                              >
                                {label}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        )
                      }}
                    </group.Subscribe>
                  </Stack>

                  <Stack direction="row" gap={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: TOGGLE_LABEL_MIN_WIDTH }}>
                      Accessory Slots
                    </Typography>
                    <group.Subscribe selector={({ values }) => values.attachmentPoints}>
                      {(attachmentPoints) => {
                        const toggleSlot = (slot: string) => {
                          const updatedSlots = attachmentPoints.includes(slot)
                            ? attachmentPoints.filter((s) => s !== slot)
                            : [...attachmentPoints, slot]
                          group.setFieldValue("attachmentPoints", updatedSlots)
                        }
                        return (
                          <ToggleButtonGroup size="small">
                            {attachmentSlots.map(({ label, value }) => (
                              <ToggleButton
                                key={value}
                                value={value}
                                selected={attachmentPoints.includes(value)}
                                onClick={() => toggleSlot(value)}
                              >
                                {label}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        )
                      }}
                    </group.Subscribe>
                  </Stack>

                  <Stack direction="row" gap={1}>
                    <group.AppField
                      name="recoil"
                      validators={{
                        onChange: z
                          .number("Recoil is required")
                          .min(0, "Recoil must be 0 or more"),
                      }}
                    >
                      {(field) => (
                        <field.NumberField
                          label="Recoil"
                          size="small"
                          sx={{ width: 100 }}
                        />
                      )}
                    </group.AppField>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Ammo
                  </Typography>
                  <Stack direction="row" gap={1}>
                    <group.AppField
                      name="ammo.size"
                      validators={{
                        onChange: z
                          .number("Ammo size is required")
                          .int("Must be a whole number")
                          .min(0, "Must be 0 or more"),
                      }}
                    >
                      {(field) => (
                        <field.NumberField
                          label="Capacity"
                          size="small"
                          sx={{ flex: 1 }}
                          slotProps={{ htmlInput: { min: 0, step: 1 } }}
                        />
                      )}
                    </group.AppField>

                    <group.AppField name="ammo.type">
                      {(field) => (
                        <field.SelectField
                          label="Feed Type"
                          size="small"
                          sx={{ flex: 1 }}
                          options={ammoTypeOptions}
                        />
                      )}
                    </group.AppField>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Ranges (m)
                  </Typography>
                  <Stack direction="row" gap={1}>
                    <group.AppField
                      name="ranges.short"
                      validators={{
                        onChange: z.number("Range is required").min(0),
                      }}
                    >
                      {(field) => (
                        <field.NumberField label="Short" size="small" sx={{ flex: 1 }} />
                      )}
                    </group.AppField>

                    <group.AppField
                      name="ranges.medium"
                      validators={{
                        onChange: z.number("Range is required").min(0),
                      }}
                    >
                      {(field) => (
                        <field.NumberField label="Medium" size="small" sx={{ flex: 1 }} />
                      )}
                    </group.AppField>

                    <group.AppField
                      name="ranges.long"
                      validators={{
                        onChange: z.number("Range is required").min(0),
                      }}
                    >
                      {(field) => (
                        <field.NumberField label="Long" size="small" sx={{ flex: 1 }} />
                      )}
                    </group.AppField>

                    <group.AppField
                      name="ranges.extreme"
                      validators={{
                        onChange: z.number("Range is required").min(0),
                      }}
                    >
                      {(field) => (
                        <field.NumberField label="Extreme" size="small" sx={{ flex: 1 }} />
                      )}
                    </group.AppField>
                  </Stack>
                </Stack>
              )
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
