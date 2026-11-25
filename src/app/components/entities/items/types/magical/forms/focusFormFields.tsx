import Typography from "@mui/material/Typography"

import { FocusLink, focusLinkByType, FocusType } from "#data/magic/focusData.ts"
import { SpellCategory } from "#data/magic/spellData.ts"
import { SpiritType, SpiritTypeLabels } from "#data/magic/spiritData.ts"
import { focusFormOpts } from "#forms/items/types/magical/useFocusForm.tsx"
import type { SelectOption } from "#forms/tanstackForm/fields/selectField.tsx"
import { withFieldGroup } from "#forms/tanstackForm/useAppForm.ts"
import { getFocusBondingCost } from "#rules/magic/focusRules.ts"
import { Label } from "#ui/text/label.tsx"

const focusTypeOptions: SelectOption[] = Object.values(FocusType).map((value) => ({ label: value, value }))
const spellCategoryOptions: SelectOption[] = Object.values(SpellCategory).map((value) => ({ label: value, value }))
const spiritTypeOptions: SelectOption[] = Object.values(SpiritType).map((value) => ({
  label: SpiritTypeLabels[value],
  value,
}))

/**
 * A Focus's type, Force, and the spell category or spirit type it's tied to. Locked while the Focus
 * is Bonded, since the bond was paid for that Focus as it stands. A Weapon Focus's weapon is picked
 * separately, with `FocusWeaponField`.
 */
export const FocusFormFields = withFieldGroup({
  ...focusFormOpts,
  render: ({ group }) => {
    return (
      <group.Subscribe selector={({ values }) => values}>
        {(focus) => {
          const isBonded = !!focus.bonded
          const link = focusLinkByType[focus.focusType]

          return (
            <>
              <Label label="Focus" />

              <group.AppField name="focusType">
                {(field) => (
                  <field.SelectField
                    label="Focus Type"
                    size="small"
                    fullWidth
                    disabled={isBonded}
                    options={focusTypeOptions}
                  />
                )}
              </group.AppField>

              <group.AppField name="force">
                {(field) => <field.CounterField label="Force" min={1} max={12} disabled={isBonded} />}
              </group.AppField>

              {link === FocusLink.spellCategory && (
                <group.AppField name="spellCategory">
                  {(field) => (
                    <field.SelectField
                      label="Spell Category"
                      size="small"
                      fullWidth
                      disabled={isBonded}
                      options={spellCategoryOptions}
                    />
                  )}
                </group.AppField>
              )}

              {link === FocusLink.spiritType && (
                <group.AppField name="spiritType">
                  {(field) => (
                    <field.SelectField
                      label="Spirit Type"
                      size="small"
                      fullWidth
                      disabled={isBonded}
                      options={spiritTypeOptions}
                    />
                  )}
                </group.AppField>
              )}

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {isBonded
                  ? "Bonded. Unbond the focus to change its type, Force, or link."
                  : `Bonding costs ${getFocusBondingCost(focus)} Karma.`}
              </Typography>
            </>
          )
        }}
      </group.Subscribe>
    )
  },
})
