import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"

import { GameEffectRow } from '#/components/GameEffects/game-effect-row.tsx"
import { getDefaultTarget } from '#/components/GameEffects/game-effect-utils.ts"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { GameEffectData } from '#/lib/system/game-effects/game-effect-data.ts"
import { GameEffectType } from '#/lib/system/game-effects/game-effect-type.ts"
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
                    const defaultTarget = getDefaultTarget(GameEffectType.attrMod) ?? AttributeKey.body
                    field.handleChange([
                      ...effects,
                      {
                        type: GameEffectType.attrMod,
                        target: defaultTarget,
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
