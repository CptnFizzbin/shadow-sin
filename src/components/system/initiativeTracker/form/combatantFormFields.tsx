import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"
import { z } from "zod"

import { Label } from "#/components/ui/text/label.tsx"
import type { CombatantForm } from "#/lib/hooks/system/initiativeTracker/form/useCombatantForm.ts"
import { AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"

interface CombatantFormFieldsProps {
  form: CombatantForm
}

export const CombatantFormFields: FC<CombatantFormFieldsProps> = ({ form }) => {
  return (
    <form.AppForm>
      <Stack sx={{ gap: 2, pt: 1 }}>
        <form.AppField name="isPC">
          {(field) => (
            <ToggleButtonGroup
              exclusive
              size="small"
              value={field.state.value ? "pc" : "npc"}
              onChange={(_, value) => value && field.handleChange(value === "pc")}
            >
              <ToggleButton value="pc" sx={{ flexGrow: 1 }}>Runner</ToggleButton>
              <ToggleButton value="npc" sx={{ flexGrow: 1 }}>NPC</ToggleButton>
            </ToggleButtonGroup>
          )}
        </form.AppField>

        <form.AppField name="name" validators={{ onChange: z.string().min(1, "Name is required") }}>
          {(field) => <field.TextField label="Name" required autoFocus />}
        </form.AppField>

        <Stack direction="row" sx={{ gap: 1 }}>
          <form.AppField name="score" validators={{ onChange: z.number({ error: "Score is required" }) }}>
            {(field) => <field.NumberField label="Score" sx={{ width: 100 }} slotProps={{ htmlInput: { min: 0 } }} />}
          </form.AppField>

          <form.AppField name="totalPasses">
            {(field) => (
              <Stack sx={{ gap: 0.5 }}>
                <Label label="Passes" />
                <field.CounterField min={1} max={5} />
              </Stack>
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.isPC}>
            {(isPC) => !isPC && (
              <form.AppField name="initiativeDice">
                {(field) => (
                  <field.NumberField label="Initiative" sx={{ width: 100 }} slotProps={{ htmlInput: { min: 0 } }} />
                )}
              </form.AppField>
            )}
          </form.Subscribe>
        </Stack>

        <form.Subscribe selector={(state) => state.values.isPC}>
          {(isPC) => !isPC && (
            <>
              <Stack sx={{ gap: 0.5 }}>
                <Label label="Attributes" variant="outlined" />
                <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                  {AttributeOrder.map((key) => (
                    <form.AppField key={key} name={`attributes.${key}`}>
                      {(field) => (
                        <field.NumberField
                          label={AttributeLabels[key]}
                          sx={{ width: 72 }}
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      )}
                    </form.AppField>
                  ))}
                </Stack>
              </Stack>

              <Stack direction="row" sx={{ gap: 1 }}>
                <form.AppField name="armor">
                  {(field) => <field.TextField label="Armor" placeholder="8/6" sx={{ width: 100 }} />}
                </form.AppField>
                <form.AppField name="resistBod">
                  {(field) => <field.NumberField label="Resist BOD" sx={{ width: 140 }} />}
                </form.AppField>
                <form.AppField name="resistWil">
                  {(field) => <field.NumberField label="Resist WIL" sx={{ width: 140 }} />}
                </form.AppField>
              </Stack>

              <form.AppField name="skills">
                {(field) => {
                  const skills = field.state.value ?? []
                  return (
                    <Stack sx={{ gap: 0.5 }}>
                      <Label label="Skills" variant="outlined" />

                      {skills.map((skill, index) => (
                        <Stack key={index} direction="row" sx={{ gap: 1, alignItems: "flex-start" }}>
                          <TextField
                            label="Skill"
                            size="small"
                            fullWidth
                            value={skill.name}
                            onChange={(e) => field.replaceValue(index, { ...skill, name: e.target.value })}
                          />
                          <TextField
                            label="Pool"
                            type="number"
                            size="small"
                            sx={{ width: 90 }}
                            value={skill.pool}
                            onChange={(e) => field.replaceValue(index, { ...skill, pool: Number(e.target.value) })}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="Remove skill"
                            onClick={() => field.removeValue(index)}
                          >
                            <RiDeleteBin6Line size={16} />
                          </IconButton>
                        </Stack>
                      ))}

                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        startIcon={<RiAddLine />}
                        onClick={() => field.pushValue({ name: "", pool: 1 })}
                      >
                        Add Skill
                      </Button>
                    </Stack>
                  )
                }}
              </form.AppField>

              <form.AppField name="weapons">
                {(field) => {
                  const weapons = field.state.value ?? []
                  return (
                    <Stack sx={{ gap: 0.5 }}>
                      <Label label="Weapons" variant="outlined" />

                      {weapons.map((weapon, index) => (
                        <Stack
                          key={index}
                          sx={{ gap: 1, padding: 1, border: "1px solid", borderColor: "divider" }}
                        >
                          <Stack direction="row" sx={{ gap: 1 }}>
                            <TextField
                              label="Weapon"
                              size="small"
                              fullWidth
                              value={weapon.name}
                              onChange={(e) => field.replaceValue(index, { ...weapon, name: e.target.value })}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="Remove weapon"
                              onClick={() => field.removeValue(index)}
                            >
                              <RiDeleteBin6Line size={16} />
                            </IconButton>
                          </Stack>
                          <Stack direction="row" sx={{ gap: 1 }}>
                            <TextField
                              label="Pool"
                              type="number"
                              size="small"
                              sx={{ width: 80 }}
                              value={weapon.pool}
                              onChange={(e) => field.replaceValue(index, { ...weapon, pool: Number(e.target.value) })}
                            />
                            <TextField
                              label="DV"
                              size="small"
                              sx={{ width: 80 }}
                              value={weapon.dv}
                              onChange={(e) => field.replaceValue(index, { ...weapon, dv: e.target.value })}
                            />
                            <TextField
                              label="AP"
                              size="small"
                              sx={{ width: 80 }}
                              value={weapon.ap}
                              onChange={(e) => field.replaceValue(index, { ...weapon, ap: e.target.value })}
                            />
                            <TextField
                              label="Modes"
                              size="small"
                              fullWidth
                              value={weapon.modes ?? ""}
                              onChange={(e) =>
                                field.replaceValue(index, { ...weapon, modes: e.target.value || undefined })}
                            />
                          </Stack>
                        </Stack>
                      ))}

                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        startIcon={<RiAddLine />}
                        onClick={() => field.pushValue({ name: "", pool: 1, dv: "", ap: "" })}
                      >
                        Add Weapon
                      </Button>
                    </Stack>
                  )
                }}
              </form.AppField>
            </>
          )}
        </form.Subscribe>
      </Stack>
    </form.AppForm>
  )
}
