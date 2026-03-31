import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import type { FC } from "react"

import { SourceFieldGroup } from "#/components/CharacterBuilder/General/Form/SourceFieldGroup.tsx"
import type { SpellForm } from "#/components/Spells/Form/UseSpellForm.ts"

export interface SpellFormFieldsProps {
  form: SpellForm
}

export const SpellFormFields: FC<SpellFormFieldsProps> = ({ form }) => {
  return (
    <form.AppForm>
      <Stack gap={2} sx={{ pt: 1 }}>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" required />}
        </form.AppField>

        <form.AppField name="category">
          {(field) => (
            <field.SelectField
              label="Category"
              required
              options={[
                { label: "Combat", value: "Combat" },
                { label: "Detection", value: "Detection" },
                { label: "Health", value: "Health" },
                { label: "Illusion", value: "Illusion" },
                { label: "Manipulation", value: "Manipulation" },
              ]}
            />
          )}
        </form.AppField>

        <Stack direction="row" gap={2}>
          <form.AppField name="type">
            {(field) => (
              <field.SelectField
                label="Type"
                required
                sx={{ flexGrow: 1 }}
                options={[
                  { label: "Physical", value: "Physical" },
                  { label: "Mana", value: "Mana" },
                ]}
              />
            )}
          </form.AppField>

          <form.AppField name="damage">
            {(field) => (
              <field.SelectField
                label="Damage"
                required
                sx={{ flexGrow: 1 }}
                options={[
                  { label: "Physical", value: "Physical" },
                  { label: "Stun", value: "Stun" },
                ]}
              />
            )}
          </form.AppField>
        </Stack>

        <form.AppField name="range">
          {(field) => (
            <field.SelectField
              label="Range"
              required
              options={[
                { label: "Touch", value: "Touch" },
                { label: "Line of Sight", value: "LoS" },
                { label: "Line of Sight (Area)", value: "LoS (A)" },
              ]}
            />
          )}
        </form.AppField>

        <Stack direction="row" gap={2}>
          <form.AppField name="duration">
            {(field) => (
              <field.SelectField
                label="Duration"
                required
                sx={{ flexGrow: 1 }}
                options={[
                  { label: "Instantaneous", value: "Instantaneous" },
                  { label: "Sustained", value: "Sustained" },
                  { label: "Permanent", value: "Permanent" },
                ]}
              />
            )}
          </form.AppField>

          <form.AppField name="drainValueMod">
            {(field) => (
              <field.NumberField
                label="Drain Modifier"
                sx={{ width: 150 }}
                slotProps={{ htmlInput: { min: -4, max: 4, step: 1 } }}
              />
            )}
          </form.AppField>
        </Stack>

        <Stack direction="row" gap={2}>
          <form.AppField name="dealsDamage">
            {(field) => (
              <ToggleButton
                value="dealsDamage"
                selected={field.state.value}
                onChange={() => field.handleChange(!field.state.value)}
                size="small"
                sx={{ flexGrow: 1 }}
              >
                Deals Damage
              </ToggleButton>
            )}
          </form.AppField>

          <form.AppField name="voluntaryTargetsOnly">
            {(field) => (
              <ToggleButton
                value="voluntaryTargetsOnly"
                selected={field.state.value}
                onChange={() => field.handleChange(!field.state.value)}
                size="small"
                sx={{ flexGrow: 1 }}
              >
                Voluntary Targets Only
              </ToggleButton>
            )}
          </form.AppField>
        </Stack>

        <form.AppField name="threshold">
          {(field) => <field.TextField label="Threshold" />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.TextField label="Description" multiline rows={3} />
          )}
        </form.AppField>

        <SourceFieldGroup form={form} fields={{ source: "source" }} />
      </Stack>
    </form.AppForm>
  )
}
