import { GameEffectsSummary } from "#/components/system/gameEffects/gameEffectsSummary.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"

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
