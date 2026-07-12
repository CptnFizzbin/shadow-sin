import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { SpiritType, SpiritTypeLabels } from "#/system/magic/spiritData.ts"
import { SpiritRegistry } from "#/system/magic/spiritRegistry.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"

import type { SpiritForm } from "./useSpiritForm.ts"

interface SpiritFormFieldsProps {
  form: SpiritForm
  tradition?: TraditionData | null
}

export const SpiritFormFields: FC<SpiritFormFieldsProps> = ({ form, tradition }) => {
  return (
    <form.Subscribe selector={(state): [SpiritType, number] => [state.values.spiritType, state.values.force]}>
      {([spiritType, force]) => {
        const maxOptionalPowers = Math.floor(force / 3)
        const registryInfo = SpiritRegistry[spiritType]

        const spiritOptions = tradition
          ? [...new Set(Object.values(tradition.spiritTypes) as SpiritType[])].map((type) => ({
              label: SpiritTypeLabels[type],
              value: type,
            }))
          : Object.values(SpiritType).map((value) => ({
              label: SpiritTypeLabels[value],
              value,
            }))

        return (
          <Stack sx={{ gap: 2 }}>
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" placeholder="e.g. Guardian of the Sacred Grove" />}
            </form.AppField>

            <form.AppField name="spiritType">
              {(field) => <field.SelectField label="Spirit Type" options={spiritOptions} />}
            </form.AppField>

            <Stack direction="row" sx={{ gap: 2 }}>
              <form.AppField name="force">
                {(field) => (
                  <field.NumberField
                    label="Force"
                    sx={{ flexGrow: 1 }}
                    slotProps={{ htmlInput: { min: 1, max: 20 } }}
                  />
                )}
              </form.AppField>

              <form.AppField name="bound">
                {(field) => (
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                      />
                    )}
                    label="Bound?"
                  />
                )}
              </form.AppField>
            </Stack>

            <Stack direction="row" sx={{ gap: 2 }}>
              <form.AppField name="services.max">
                {(field) => (
                  <field.NumberField
                    label="Max Services"
                    sx={{ flexGrow: 1 }}
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                )}
              </form.AppField>

              <form.AppField name="services.used">
                {(field) => (
                  <field.NumberField
                    label="Used Services"
                    sx={{ flexGrow: 1 }}
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                )}
              </form.AppField>
            </Stack>

            {registryInfo && (
              <Stack sx={{ gap: 1 }}>
                <Label label="Optional Powers" variant="text" />
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Pick up to {maxOptionalPowers} powers (1 per 3 Force)
                </Typography>
                <form.AppField name="optionalPowers">
                  {(field) => {
                    const overflow = field.state.value.length - maxOptionalPowers
                    return (
                      <>
                        <FormGroup>
                          {registryInfo.optionalPowers.map((power: string) => (
                            <FormControlLabel
                              key={power}
                              control={(
                                <Checkbox
                                  size="small"
                                  checked={field.state.value.includes(power)}
                                  disabled={
                                    !field.state.value.includes(power)
                                    && field.state.value.length >= maxOptionalPowers
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.handleChange([...field.state.value, power])
                                    } else {
                                      field.handleChange(field.state.value.filter((p: string) => p !== power))
                                    }
                                  }}
                                />
                              )}
                              label={power}
                            />
                          ))}
                        </FormGroup>
                        {overflow > 0 && (
                          <Typography
                            variant="caption"
                            color="warning.main"
                            role="status"
                            aria-live="polite"
                          >
                            {`Selected ${field.state.value.length} of ${maxOptionalPowers} allowed — uncheck ${overflow} to change picks`}
                          </Typography>
                        )}
                      </>
                    )
                  }}
                </form.AppField>
              </Stack>
            )}

            <form.AppField name="notes">
              {(field) => <field.TextField label="Notes" multiline rows={3} />}
            </form.AppField>
          </Stack>
        )
      }}
    </form.Subscribe>
  )
}
