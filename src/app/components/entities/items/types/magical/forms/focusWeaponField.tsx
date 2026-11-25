import type { FC } from "react"

import { FocusLink, focusLinkByType } from "#/data/magic/focusData.ts"
import type { useFocusForm } from "#/forms/items/types/magical/useFocusForm.tsx"
import type { SelectOption } from "#/forms/tanstackForm/fields/selectField.tsx"

interface FocusWeaponFieldProps {
  form: ReturnType<typeof useFocusForm>
  /** The Runner's weapons a Weapon Focus can be attached to. */
  weaponOptions: SelectOption[]
}

/**
 * The weapon a Weapon Focus is attached to, which its bonus reaches; nothing for any other type.
 * Locked while the Focus is Bonded.
 */
export const FocusWeaponField: FC<FocusWeaponFieldProps> = ({ form, weaponOptions }) => (
  <form.Subscribe selector={({ values }) => ({ focusType: values.focusType, isBonded: !!values.bonded })}>
    {({ focusType, isBonded }) => focusLinkByType[focusType] === FocusLink.weapon && (
      <form.AppField name="items.parentId">
        {(field) => (
          <field.SelectField
            label="Linked Weapon"
            size="small"
            fullWidth
            nullable
            disabled={isBonded}
            options={[{ label: "None", value: "" }, ...weaponOptions]}
          />
        )}
      </form.AppField>
    )}
  </form.Subscribe>
)
