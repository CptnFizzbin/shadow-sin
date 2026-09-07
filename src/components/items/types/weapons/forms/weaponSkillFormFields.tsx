import Stack from "@mui/material/Stack"

import { weaponFormOpts } from "#/hooks/items/types/weapons/forms/useWeaponForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { AiAttributes, AttributeKey } from "#/system/attributeKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

const skillOptions = Object.entries(skillList)
  .filter(([_, skill]) => skill.isWeaponSkill)
  .map(([key, _]) => ({
    label: key,
    value: key,
  }))

const attributeOptions = [
  { label: "None", value: "" },
  // AI's Rating/System/Firewall/Response/Signal are always computed, never stored on
  // RunnerData.attributes — picking one here would silently lock the dice pool to 0.
  ...Object.values(AttributeKey)
    .filter((key) => !AiAttributes.includes(key))
    .map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: key,
    })),
]

export const WeaponSkillFormFields = withFieldGroup({
  ...weaponFormOpts,
  render: ({ group }) => {
    return (
      <Stack direction="row">
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
