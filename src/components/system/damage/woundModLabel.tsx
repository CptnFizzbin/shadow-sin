import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { DamageSelectors } from "#/stores/runner/damage/damageSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const WoundModLabel: FC = () => {
  const woundMod = useRunnerSelector(DamageSelectors.selectWoundMod)

  return (
    <Label
      label={`Wound Mod: ${woundMod}`}
      variant="text"
      color={woundMod >= 1 ? "error.main" : "primary.dark"}
    />
  )
}
