import Stack from "@mui/material/Stack"

import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { weaponFormOpts } from "#/lib/hooks/items/types/weapons/forms/useWeaponForm.tsx"
import { SelectorOptions } from "#/system/selectorOptions.tsx"

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
              options={SelectorOptions.weaponSkill}
            />
          )}
        </group.AppField>

        <group.AppField name="attribute">
          {(field) => (
            <field.SelectField
              label="Attribute"
              size="small"
              sx={{ flex: 1 }}
              options={SelectorOptions.weaponSkillAttribute}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
