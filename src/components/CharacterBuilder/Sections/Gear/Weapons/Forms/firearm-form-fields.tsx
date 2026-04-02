import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { z } from "zod"

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
import { Label } from "#/components/UI/Text/Label.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import { FirearmAttachmentPoint } from "#/lib/system/gear/weaponData.ts"
import { firearmTypes } from "#/lib/system/gear/weapons/firearms/firearm-type-info.ts"

const firearmTypeOptions = Object.entries(firearmTypes).map(([type, value]) => ({
  label: type,
  value: type,
  group: value.weaponGroup,
}))

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
  { label: "Single Shot", value: "SS" },
  { label: "Semi Auto", value: "SA" },
  { label: "Burst Fire", value: "B" },
  { label: "Full Auto", value: "FA" },
]

const attachmentSlots = [
  { label: "Top", value: FirearmAttachmentPoint.Top },
  { label: "Barrel", value: FirearmAttachmentPoint.Barrel },
  { label: "Under", value: FirearmAttachmentPoint.Under },
]

export const FirearmFormFields = withFieldGroup({
  ...weaponFormOpts,
  render: ({ group }) => (
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
            <field.NumberField label="Recoil" />
          )}
        </group.AppField>
      </Stack>

      <WeaponSkillFormFields form={group} fields={weaponFieldMap} />
      <WeaponDamageFormFields form={group} fields={weaponFieldMap} />

      <Stack>
        <Label label="Firing Modes" variant="text" />

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
                    sx={{ flex: 1 }}
                  >
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )
          }}
        </group.Subscribe>
      </Stack>

      <Stack>
        <Label label="Accessory Slots" variant="text" />

        <group.Subscribe selector={({ values }) => values.attachmentPoints}>
          {(attachmentPoints) => {
            const toggleSlot = (slot: FirearmAttachmentPoint) => {
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
                    sx={{ flex: 1 }}
                  >
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )
          }}
        </group.Subscribe>
      </Stack>

      <Stack>
        <Label label="Ammo" variant="text" />

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
      </Stack>
    </Stack>
  ),
})
