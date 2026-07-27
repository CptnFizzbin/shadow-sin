import Stack from "@mui/material/Stack"

import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { weaponFormOpts } from "#/lib/hooks/items/types/weapons/forms/useWeaponForm.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

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
      <Stack direction="row" sx={{ gap: 1 }}>
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
