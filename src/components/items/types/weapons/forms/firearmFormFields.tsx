import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import { z } from "zod"

import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { FirearmAttachmentPoint } from "#/system/gear/weaponData.ts"
import { firearmTypes } from "#/system/gear/weapons/firearms/firearmTypeInfo.ts"
import type { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"

import { weaponFieldMap, weaponFormOpts } from "./useWeaponForm.tsx"
import { WeaponDamageFormFields } from "./weaponDamageFormFields.tsx"
import { WeaponSkillFormFields } from "./weaponSkillFormFields.tsx"

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
    <Stack sx={{ gap: 1 }}>
      <group.AppField
        name="firearmType"
        listeners={{
          onChange: ({ value, fieldApi }) => {
            const skill = firearmTypes[value as FirearmTypeKey]?.skill
            if (skill) {
              fieldApi.form.setFieldValue("skill", skill)
            }
            if (!fieldApi.form.getFieldValue("attribute")) {
              fieldApi.form.setFieldValue("attribute", AttributeKey.agility)
            }
          },
        }}
      >
        {(field) => (
          <field.SelectField
            label="Firearm Type"
            size="small"
            fullWidth
            options={firearmTypeOptions}
          />
        )}
      </group.AppField>

      <Stack direction="row" sx={{ gap: 1 }}>
        <group.AppField
          name="recoil"
          validators={{
            onChange: z
              .number("Recoil is required")
              .min(0, "Recoil must be 0 or more"),
          }}
        >
          {(field) => (
            <field.CounterField label="Recoil" min={0} max={20} />
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
              <Stack direction="row" sx={{ flexWrap: "wrap" }}>
                {firingModes.map(({ label, value }) => (
                  <FormControlLabel
                    key={value}
                    label={label}
                    control={(
                      <Checkbox
                        checked={firemodes.includes(value)}
                        onChange={() => toggleMode(value)}
                        size="small"
                      />
                    )}
                  />
                ))}
              </Stack>
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
              <Stack direction="row" sx={{ flexWrap: "wrap" }}>
                {attachmentSlots.map(({ label, value }) => (
                  <FormControlLabel
                    key={value}
                    label={label}
                    control={(
                      <Checkbox
                        checked={attachmentPoints.includes(value)}
                        onChange={() => toggleSlot(value)}
                        size="small"
                      />
                    )}
                  />
                ))}
              </Stack>
            )
          }}
        </group.Subscribe>
      </Stack>

      <Stack>
        <Label label="Ammo" variant="text" />

        <Stack direction="row" sx={{ gap: 1 }}>
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
        </Stack>
      </Stack>
    </Stack>
  ),
})
