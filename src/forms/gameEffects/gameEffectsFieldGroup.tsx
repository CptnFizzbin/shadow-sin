import type { GameEffectData } from "#/data/gameEffects/gameEffectData.ts"
import { withFieldGroup } from "#/forms/tanstackForm/useAppForm.ts"

import { GameEffectsSummary } from "./gameEffectsSummary.tsx"

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
            <GameEffectsSummary
              effects={effects}
              onChange={(updated) => field.handleChange(updated)}
            />
          )
        }}
      </group.AppField>
    )
  },
})
