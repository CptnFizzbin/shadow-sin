import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"

import { GameEffectRow } from "#/components/GameEffects/GameEffectRow.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { GameEffectData } from "#/lib/system/GameEffects/GameEffectData.ts"
import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

interface FormFields {
  effects?: GameEffectData[]
}

export const GameEffectsFieldGroup = withFieldGroup({
  defaultValues: {
    effects: [],
  } as FormFields,
  render: ({ group }) => {
    return (
      <group.AppField name="effects">
        {(field) => {
          const effects = (field.state.value as GameEffectData[]) ?? []

          return (
            <Stack gap={1}>
              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">Effects</Typography>
                <Button
                  size="small"
                  startIcon={<RiAddLine size={14} />}
                  onClick={() => {
                    field.handleChange([
                      ...effects,
                      {
                        type: GameEffectType.attrMod,
                        target: AttributeKey.body,
                        value: 0,
                      },
                    ])
                  }}
                >
                  Add Effect
                </Button>
              </Stack>

              {effects.map((effect, index) => (
                <GameEffectRow
                  key={`${effect.type}-${effect.target ?? "none"}-${index}`}
                  effect={effect}
                  onChange={(updated) => {
                    const newEffects = [...effects]
                    newEffects[index] = updated
                    field.handleChange(newEffects)
                  }}
                  onRemove={() => {
                    field.handleChange(effects.filter((_, i) => i !== index))
                  }}
                />
              ))}
            </Stack>
          )
        }}
      </group.AppField>
    )
  },
})
