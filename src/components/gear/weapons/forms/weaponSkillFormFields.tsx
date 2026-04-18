import Stack from "@mui/material/Stack"

import { weaponFormOpts } from "#/components/gear/weapons/forms/useWeaponForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { skillList } from "#/lib/system/skills/skillList.ts"

const skillOptions = Object.entries(skillList)
  .filter(([_, skill]) => skill.isWeaponSkill)
  .map(([key, _]) => ({
    label: key,
    value: key,
  }))

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
