import Stack from "@mui/material/Stack"

import { weaponFormOpts } from "#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/use-weapon-form.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/use-app-form.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { Skills } from "#/lib/system/skill-key.ts"

const skillOptions = [
  { label: "None", value: "" },
  ...Object.entries(Skills)
    .filter(([_, skill]) => skill.isWeaponSkill)
    .map(([key, _]) => ({
      label: key,
      value: key,
    })),
]

const attributeOptions = [
  { label: "None", value: "" },
  ...Object.values(AttributeKey).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: key,
  })),
]

export const WeaponSkillFormFields = withFieldGroup({
  ...weaponFormOpts,
  render: ({ group }) => {
    return (
      <Stack direction="row" gap={1}>
        <group.AppField name="skill">
          {(field) => (
            <field.SelectField
              label="Skill"
              size="small"
              sx={{ flex: 1 }}
              options={skillOptions}
            />
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
    )
  },
})
