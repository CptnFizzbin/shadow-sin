import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"

import { weaponFormOpts } from "#/components/weapons/forms/useWeaponForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

const damageTypeOptions: Array<{ label: string, value: "physical" | "stun" | "custom" }> = [
  { label: "Physical", value: "physical" },
  { label: "Stun", value: "stun" },
  { label: "Custom", value: "custom" },
]

export const WeaponDamageFormFields = withFieldGroup({
  ...weaponFormOpts,
  render: ({ group }) => {
    return (
      <Stack direction="row" sx={{ gap: 1, alignItems: "flex-start" }}>
        <group.Subscribe selector={({ values }) => values.dmgType}>
          {(dmgType) => (
            <Stack sx={{ gap: 0.5 }}>
              <ButtonGroup size="small" variant="outlined">
                {damageTypeOptions.map(({ label, value }) => (
                  <Button
                    key={value}
                    variant={dmgType === value ? "contained" : "outlined"}
                    onClick={() => group.setFieldValue("dmgType", value)}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>

              {dmgType === "custom"
                ? (
                    <group.AppField name="dmg">
                      {(field) => (
                        <field.TextField label="Damage" size="small" sx={{ flex: 1 }} />
                      )}
                    </group.AppField>
                  )
                : (
                    <group.AppField name="dmgValue">
                      {(field) => (
                        <field.CounterField label="Damage" min={0} max={99} />
                      )}
                    </group.AppField>
                  )}
            </Stack>
          )}
        </group.Subscribe>

        <group.AppField name="ap">
          {(field) => (
            <field.CounterField label="AP" min={-20} max={10} />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
