import ButtonGroup from "@mui/material/ButtonGroup"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import type { FC } from "react"

import { GameEffectsFieldGroup } from "#/components/system/gameEffects/gameEffectsFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/system/sources/sourceFieldGroup.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/system/magic/spellData.ts"

import type { SpellForm } from "./useSpellForm.ts"

interface SpellFormFieldsProps {
  form: SpellForm
}

export const SpellFormFields: FC<SpellFormFieldsProps> = ({ form }) => {
  return (
    <form.AppForm>
      <Stack sx={{ pt: 1 }}>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" />}
        </form.AppField>

        <form.AppField name="category">
          {(field) => (
            <field.SelectField
              label="Category"
              options={Object.values(SpellCategory).map((value) => ({ label: value, value }))}
            />
          )}
        </form.AppField>

        <form.AppField name="type">
          {(field) => (
            <field.SelectField
              label="Type"
              sx={{ flexGrow: 1 }}
              options={Object.values(SpellType).map((value) => ({ label: value, value }))}
            />
          )}
        </form.AppField>

        <form.AppField name="range">
          {(field) => (
            <field.SelectField
              label="Range"
              options={[
                { label: "Touch", value: SpellRange.Touch },
                { label: "Line of Sight", value: SpellRange.LoS },
                { label: "Line of Sight (Area)", value: SpellRange.LoSArea },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="threshold">
          {(field) => <field.TextField label="Threshold" />}
        </form.AppField>

        <form.AppField name="duration">
          {(field) => (
            <field.SelectField
              label="Duration"
              sx={{ flexGrow: 1 }}
              options={Object.values(SpellDuration).map((value) => ({ label: value, value }))}
            />
          )}
        </form.AppField>

        <Stack direction="row" sx={{ alignItems: "flex-end" }}>
          <form.AppField name="drain.type">
            {(field) => (
              <field.SelectField
                label="Drain"
                sx={{ flexGrow: 1 }}
                options={[
                  { label: "Force ÷ 2", value: SpellDrainType.Force },
                  { label: "Fixed", value: SpellDrainType.Fixed },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.drain.type}>
            {(drainType) => (
              <form.AppField name="drain.value">
                {(field) => (
                  <field.CounterField
                    label={drainType === SpellDrainType.Fixed ? "Value" : "Mod"}
                    min={drainType === SpellDrainType.Fixed ? 1 : -4}
                    max={drainType === SpellDrainType.Force ? 4 : undefined}
                  />
                )}
              </form.AppField>
            )}
          </form.Subscribe>
        </Stack>

        <Divider />

        <form.AppField name="dealsDamage">
          {(dealsDmgfield) => (
            <Stack sx={{ flexGrow: 1 }}>
              <Label label="Deals Damage?" variant="text" />
              <Stack direction="row">
                <ButtonGroup>
                  <ToggleButton
                    value="voluntaryTargetsOnly"
                    selected={!dealsDmgfield.state.value}
                    onChange={() => dealsDmgfield.handleChange(false)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  >
                    No
                  </ToggleButton>
                  <ToggleButton
                    value="voluntaryTargetsOnly"
                    selected={dealsDmgfield.state.value}
                    onChange={() => dealsDmgfield.handleChange(true)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  >
                    Yes
                  </ToggleButton>
                </ButtonGroup>

                <form.AppField name="damage">
                  {(dmgTypeField) => (
                    <dmgTypeField.SelectField
                      disabled={!dealsDmgfield.state.value}
                      label="Damage Type"
                      sx={{ flexGrow: 1 }}
                      options={Object.values(SpellDamage).map((value) => ({ label: value, value }))}
                    />
                  )}
                </form.AppField>
              </Stack>
            </Stack>
          )}
        </form.AppField>

        <Divider />

        <form.AppField name="voluntaryTargetsOnly">
          {(field) => (
            <Stack sx={{ flexGrow: 1 }}>
              <Label label="Voluntary Targets Only?" variant="text" />
              <ButtonGroup>
                <ToggleButton
                  value="voluntaryTargetsOnly"
                  selected={!field.state.value}
                  onChange={() => field.handleChange(false)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                >
                  No
                </ToggleButton>
                <ToggleButton
                  value="voluntaryTargetsOnly"
                  selected={field.state.value}
                  onChange={() => field.handleChange(true)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                >
                  Yes
                </ToggleButton>
              </ButtonGroup>
            </Stack>
          )}
        </form.AppField>

        <Divider />

        <form.AppField name="description">
          {(field) => (
            <field.TextField label="Description" multiline rows={3} />
          )}
        </form.AppField>

        <SourceFieldGroup form={form} fields={{ source: "source" }} />

        <GameEffectsFieldGroup form={form} fields={{ effects: "effects" }} />
      </Stack>
    </form.AppForm>
  )
}
